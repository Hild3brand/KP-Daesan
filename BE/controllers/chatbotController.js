import db from "../database/db.js";
import { buildChatRequest } from "../services/requestBuilder.js";
import { callHyperClova } from "../services/hyperclovaClient.js";
import { processClovaResponse } from "../services/responseProcessor.js";
import { logMetric } from "../utils/logger.js";


// ==========================================
// HELPER: SAVE CHAT MESSAGE
// ==========================================
const saveMessage = async ({
  userId,
  sender,
  message,
  type = "chat",
}) => {
  await db.query(
    `
    INSERT INTO chat_messages
    (user_id, sender, message_type, message)
    VALUES (?, ?, ?, ?)
    `,
    [userId, sender, type, message]
  );
};


// ==========================================
// CHAT
// ==========================================
export const chat = async (req, res) => {
  const start = Date.now();

  try {
    if (!req.body?.message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const userId = req.userId;
    const { message } = req.body;

    const payload = buildChatRequest(message);

    const clovaResponse =
      await callHyperClova(payload);

    const result =
      processClovaResponse(clovaResponse);

    await saveMessage({
      userId,
      sender: "user",
      message,
      type: "chat",
    });

    await saveMessage({
      userId,
      sender: "ai",
      message: result.message,
      type: "chat",
    });

    logMetric(
      message,
      result.message,
      Date.now() - start
    );

    return res.json({
      success: true,
      reply: result.message,
    });

  } catch (error) {

    console.error(
      "Chatbot Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};


// ==========================================
// GENERATE EXERCISE
// ==========================================
export const generateExercise =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const [userRows] =
        await db.query(
          `
          SELECT stage_code
          FROM users
          WHERE id = ?
          `,
          [userId]
        );

      if (!userRows.length) {

        return res.status(404).json({
          success: false,
          message:
            "User tidak ditemukan",
        });
      }

      const stage_code =
        userRows[0].stage_code;

      const [chunks] =
        await db.query(
          `
          SELECT content, name
          FROM material_chunks
          WHERE stage_code = ?
          `,
          [stage_code]
        );

      const materialContext =
        chunks
          .map(
            (c) =>
              `- ${c.name}: ${c.content}`
          )
          .join("\n");

      const [pretest] =
        await db.query(
          `
          SELECT *
          FROM pretest_results
          WHERE user_id = ?
          `,
          [userId]
        );

      const correct =
        pretest.filter(
          (p) => p.is_correct === 1
        ).length;

      let num_question = 10;

      if (correct === 1)
        num_question = 8;
      else if (correct === 2)
        num_question = 6;
      else if (correct >= 3)
        num_question = 4;

      const prompt = `
Kamu adalah tutor bahasa Korea.

Materi:
${materialContext}

Buat ${num_question} soal pilihan ganda.

FORMAT WAJIB:
[
  {
    "question": "",
    "options": ["A","B","C","D"],
    "answer": "A"
  }
]

RULES:
- JSON ONLY
- sesuai materi
- jangan ada teks lain
`;

      const payload = {
        messages: [
          {
            role: "system",
            content:
              "You are Korean Tutor AI. Output ONLY JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        maxTokens: 2000,
      };

      const response =
        await callHyperClova(payload);

      const raw =
        response?.result
          ?.message?.content || "";

      const cleaned =
        raw
          .replace(/```json|```/g, "")
          .trim();

      let parsed;

      try {

        parsed =
          JSON.parse(cleaned);

      } catch (err) {

        console.log(
          "RAW AI:",
          raw
        );

        return res.status(500).json({
          success: false,
          message:
            "Invalid JSON from AI",
        });
      }

      await saveMessage({
        userId,
        sender: "user",
        message:
          "Generate Exercise",
        type: "exercise",
      });

      await saveMessage({
        userId,
        sender: "ai",
        message:
          `Generated ${num_question} exercise`,
        type: "exercise",
      });

      return res.json({
        success: true,
        data: parsed,
        stage_code,
      });

    } catch (err) {

      console.error(
        "generateExercise error:",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };


// ==========================================
// FEEDBACK
// ==========================================
export const generateExerciseFeedback =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const { questions } =
        req.body;

      if (!questions?.length) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });
      }

      const wrongAnswers =
        questions.filter(
          (q) =>
            q.user_answer !==
            q.correct_answer
        );

      let feedback = "";

      if (
        wrongAnswers.length === 0
      ) {

        feedback =
          "Hebat! Semua jawaban kamu benar 🎉";

      } else {

        const prompt = `
Kamu adalah tutor bahasa Korea yang ramah dan membantu siswa belajar.

Tugas kamu:
Berikan feedback dari jawaban yang salah berikut, dengan cara yang mudah dipahami siswa pemula.

${JSON.stringify(wrongAnswers)}

FORMAT FEEDBACK:
- Jelaskan kenapa jawaban mereka salah
- Jelaskan jawaban yang benar
- Berikan sedikit penjelasan konsepnya
- Gunakan bahasa yang sederhana
- Tambahkan contoh singkat jika perlu

RULE:
- Jangan terlalu panjang
- Fokus membantu siswa memahami, bukan hanya mengoreksi
`;

        const clovaResponse =
          await callHyperClova({
            messages: [
              {
                role: "system",
                content:
                  "You are Korean Tutor AI",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            maxTokens: 1200,
            temperature: 0.4,
          });

        feedback =
          clovaResponse?.result
            ?.message?.content || "";
      }

      await saveMessage({
        userId,
        sender: "ai",
        message: feedback,
        type: "feedback",
      });

      return res.json({
        success: true,
        feedback,
      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({
        success: false,
        message:
          "Failed generate feedback",
      });
    }
  };


// ==========================================
// GENERATE OVERVIEW
// ==========================================
export const generateOverview =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const [users] =
        await db.query(`
          SELECT stage_code
          FROM users
          WHERE id = ?
        `, [userId]);

      if (!users.length) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      const stageCode =
        users[0].stage_code;

      const [stages] =
        await db.query(`
          SELECT stage_name
          FROM stages
          WHERE stage_code = ?
        `, [stageCode]);

      const [materials] =
        await db.query(`
          SELECT content
          FROM material_chunks
          WHERE stage_code = ?
        `, [stageCode]);

      const materialText =
        materials
          .map((m) => m.content)
          .join("\n");

      const prompt = `
Buat overview pembelajaran bahasa Korea
berdasarkan materi berikut:

${materialText}
`;

      const aiReply =
        await callHyperClova({
          messages: [
            {
              role: "system",
              content:
                "You are Daesan AI.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

      const result =
        aiReply?.result
          ?.message?.content || "";

      await saveMessage({
        userId,
        sender: "ai",
        message: result,
        type: "overview",
      });

      return res.json({
        success: true,
        reply: result,
      });

    } catch (err) {

      console.error(
        "overview error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Overview failed",
      });
    }
  };


// ==========================================
// GET CHAT HISTORY
// ==========================================
export const getChatHistory =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const [messages] =
        await db.query(`
          SELECT *
          FROM chat_messages
          WHERE user_id = ?
          ORDER BY created_at ASC
        `, [userId]);

      const formattedMessages =
        [];

      for (const msg of messages) {

        if (
          msg.exercise_session_id
        ) {

          const [sessions] =
            await db.query(`
              SELECT *
              FROM exercise_sessions
              WHERE id = ?
            `, [
              msg.exercise_session_id
            ]);

          if (sessions.length) {

            const session =
              sessions[0];

            const [questions] =
              await db.query(`
                SELECT *
                FROM exercise_questions
                WHERE exercise_session_id = ?
                ORDER BY question_order ASC
              `, [session.id]);

            for (const q of questions) {

              const [options] =
                await db.query(`
                  SELECT
                    id,
                    option_key,
                    option_text
                  FROM exercise_options
                  WHERE question_id = ?
                `, [q.id]);

              q.options = options;

              const [answers] =
                await db.query(`
                  SELECT
                    user_answer,
                    is_correct,
                    ai_feedback
                  FROM exercise_answers
                  WHERE question_id = ?
                  AND session_id = ?
                  LIMIT 1
                `, [
                  q.id,
                  session.id
                ]);

              q.answer_data =
                answers[0] || null;
            }

            formattedMessages.push({
              ...msg,
              exercise_data: {
                ...session,
                questions,
              },
            });

            continue;
          }
        }

        formattedMessages.push(msg);
      }

      return res.json({
        success: true,
        data: formattedMessages,
      });

    } catch (err) {

      console.error(
        "getChatHistory:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed load chat history",
      });
    }
  };