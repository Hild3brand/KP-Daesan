import db from "../database/db.js";

import {
  callHyperClova,
} from "../services/hyperclova/client.js";

import {
  getExercisePromptByStage,
} from "../services/hyperclova/prompts/getExercisePromptByStage.js";

import {
  buildFinalFeedbackPrompt,
} from "../services/hyperclova/prompts/buildFinalFeedbackPrompt.js";


// ======================================
// GENERATE EXERCISE
// ======================================

export const generateExercise =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      // =====================
      // USER STAGE
      // =====================

      const [users] =
        await db.query(`
          SELECT
            stage_code
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

      // =====================
      // STAGE
      // =====================

      const [stages] =
        await db.query(`
          SELECT
            stage_name,
            skill_name,
            focus_area
          FROM stages
          WHERE stage_code = ?
        `, [stageCode]);

      const stage =
        stages[0];

      // =====================
      // MATERIALS
      // =====================

      const [materials] =
        await db.query(`
          SELECT
            content
          FROM material_chunks
          WHERE stage_code = ?
        `, [stageCode]);

      const materialText =
        materials
          .map((m) => m.content)
          .join("\n");

      // =====================
      // PRETEST
      // =====================

      const [pretestStats] =
        await db.query(`
          SELECT
            COUNT(*) AS total,
            SUM(
              CASE
                WHEN pa.is_correct = 1
                THEN 1
                ELSE 0
              END
            ) AS correct
          FROM pretest_answers pa

          JOIN pretest_results pr
            ON pa.pretest_results_id = pr.id

          JOIN pretest_questions pq
            ON pa.questions_id = pq.id

          WHERE pr.user_id = ?
          AND pq.stage_code = ?
        `, [
          userId,
          stageCode,
        ]);

      const correctPretest =
        Number(
          pretestStats[0]?.correct || 0
        );

      let numQuestion = 10;

      switch (correctPretest) {

        case 0:
          numQuestion = 10;
          break;

        case 1:
          numQuestion = 8;
          break;

        case 2:
          numQuestion = 6;
          break;

        case 3:
          numQuestion = 4;
          break;

        default:
          numQuestion = 10;
      }

      // =====================
      // ERROR PROFILE
      // =====================

      const [wrongAnswers] =
        await db.query(`
          SELECT
            pa.user_answer,
            pq.question_text,
            pq.correct_answer
          FROM pretest_answers pa

          JOIN pretest_questions pq
            ON pa.questions_id = pq.id

          JOIN pretest_results pr
            ON pa.pretest_results_id = pr.id

          WHERE pr.user_id = ?
          AND pq.stage_code = ?
          AND pa.is_correct = 0
        `, [
          userId,
          stageCode,
        ]);

      const studentErrorProfile =
        wrongAnswers.length
          ? wrongAnswers
              .map((w, index) => `
${index + 1}.
Question:
${w.question_text}

Student Answer:
${w.user_answer}

Correct Answer:
${w.correct_answer}
`)
              .join("\n")
          : "";

      // =====================
      // BUILD PROMPT
      // =====================

      const exercisePrompt =
        getExercisePromptByStage({
          stageName:
            stage.stage_name,

          stageCode,

          skillName:
            stage.skill_name,

          focusArea:
            stage.focus_area,

          materialChunk:
            materialText,

          studentErrorProfile,

          numQuestion,
        });

      // =====================
      // AI GENERATE
      // =====================

      const aiResponse =
        await callHyperClova({
          systemPrompt:
            "You are Daesan AI.",

          userPrompt:
            exercisePrompt,
        });

      // =====================
      // PARSE AI
      // =====================

      let parsed;

      try {

        parsed =
          JSON.parse(aiResponse);

      } catch (err) {

        console.error(
          "INVALID AI JSON:",
          aiResponse
        );

        return res.status(500).json({
          success: false,
          message:
            "Invalid AI response",
        });
      }

      if (
        !parsed.questions ||
        !Array.isArray(parsed.questions)
      ) {

        return res.status(500).json({
          success: false,
          message:
            "Questions not found",
        });
      }

      // =====================
      // CREATE SESSION
      // =====================

      const [sessionResult] =
        await db.query(`
          INSERT INTO exercise_sessions
          (
            user_id,
            stage_code,
            total_questions,
            status
          )
          VALUES (?, ?, ?, ?)
        `, [
          userId,
          stageCode,
          parsed.questions.length,
          "ongoing",
        ]);

      const sessionId =
        sessionResult.insertId;

      // =====================
      // SAVE QUESTIONS
      // =====================

      for (
        let i = 0;
        i < parsed.questions.length;
        i++
      ) {

        const q =
          parsed.questions[i];

        const [questionResult] =
          await db.query(`
            INSERT INTO exercise_questions
            (
              exercise_session_id,
              question_code,
              question_type,
              question_text,
              correct_answer,
              mastery_if_correct,
              error_profile_if_wrong,
              question_order
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            sessionId,
            q.id,
            q.type,
            q.question,
            q.answer,
            q.diagnostic
              ?.mastery_if_correct || null,
            q.diagnostic
              ?.error_profile_if_wrong || null,
            i + 1,
          ]);

        const questionId =
          questionResult.insertId;

        // OPTIONS
        if (
          q.type === "multiple_choice" &&
          Array.isArray(q.options)
        ) {

          for (const opt of q.options) {

            await db.query(`
              INSERT INTO exercise_options
              (
                question_id,
                option_key,
                option_text
              )
              VALUES (?, ?, ?)
            `, [
              questionId,
              opt.key,
              opt.text,
            ]);
          }
        }
      }

      // =====================
      // SAVE CHAT
      // =====================

      await db.query(`
        INSERT INTO chat_messages
        (
          user_id,
          sender,
          message_type,
          exercise_session_id
        )
        VALUES (?, ?, ?, ?)
      `, [
        userId,
        "ai",
        "exercise",
        sessionId,
      ]);

      // =====================
      // LOAD QUESTIONS
      // =====================

      const [savedQuestions] =
        await db.query(`
          SELECT *
          FROM exercise_questions
          WHERE exercise_session_id = ?
          ORDER BY question_order ASC
        `, [sessionId]);

      for (const q of savedQuestions) {

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
      }

      // =====================
      // RESPONSE
      // =====================

      return res.json({
        success: true,
        data: {
          id: sessionId,
          status: "ongoing",
          final_feedback: "",
          previous_answers: [],
          questions: savedQuestions,
        },
      });

    } catch (err) {

      console.error(
        "GENERATE EXERCISE ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Generate exercise failed",
      });
    }
  };


// ======================================
// GET EXERCISE SESSION
// ======================================

export const getExerciseSession =
  async (req, res) => {

    try {

      const sessionId =
        req.params.id;

      const [sessions] =
        await db.query(`
          SELECT *
          FROM exercise_sessions
          WHERE id = ?
        `, [sessionId]);

      if (!sessions.length) {

        return res.status(404).json({
          success: false,
          message:
            "Session not found",
        });
      }

      const session =
        sessions[0];

      const [questions] =
        await db.query(`
          SELECT *
          FROM exercise_questions
          WHERE exercise_session_id = ?
          ORDER BY question_order ASC
        `, [sessionId]);

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
            LIMIT 1
          `, [q.id]);

        q.answer_data =
          answers[0] || null;
      }

      return res.json({
        success: true,
        data: {
          ...session,
          questions,
        },
      });

    } catch (err) {

      console.error(
        "GET SESSION ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
      });
    }
  };


// ======================================
// SUBMIT ANSWER
// ======================================

export const submitAnswer =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const {
        exercise_session_id,
        exercise_question_id,
        user_answer,
      } = req.body;

      if (
        !exercise_session_id ||
        !exercise_question_id
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Session and question required",
        });
      }

      // =====================
      // QUESTION
      // =====================

      const [questions] =
        await db.query(`
          SELECT
            correct_answer,
            mastery_if_correct,
            error_profile_if_wrong
          FROM exercise_questions
          WHERE id = ?
        `, [exercise_question_id]);

      if (!questions.length) {

        return res.status(404).json({
          success: false,
          message:
            "Question not found",
        });
      }

      const question =
        questions[0];

      const isCorrect =
        String(user_answer)
          .trim()
          .toLowerCase() ===
        String(question.correct_answer)
          .trim()
          .toLowerCase();

      const feedback =
        isCorrect
          ? question.mastery_if_correct
          : question.error_profile_if_wrong;

      // =====================
      // SAVE ANSWER
      // =====================

      await db.query(`
        INSERT INTO exercise_answers
        (
          session_id,
          question_id,
          user_id,
          user_answer,
          is_correct,
          ai_feedback
        )
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          user_answer = VALUES(user_answer),
          is_correct = VALUES(is_correct),
          ai_feedback = VALUES(ai_feedback)
      `, [
        exercise_session_id,
        exercise_question_id,
        userId,
        user_answer,
        isCorrect ? 1 : 0,
        feedback,
      ]);

      return res.json({
        success: true,
        is_correct:
          isCorrect,
        feedback,
      });

    } catch (err) {

      console.error(
        "SUBMIT ANSWER ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
      });
    }
  };


// ======================================
// SUBMIT EXERCISE
// ======================================

export const submitExercise =
  async (req, res) => {

    try {

      const {
        exercise_session_id,
      } = req.body;

      const [answers] =
        await db.query(`
          SELECT *
          FROM exercise_answers
          WHERE session_id = ?
        `, [exercise_session_id]);

      const total =
        answers.length;

      const correct =
        answers.filter(
          (a) =>
            Number(a.is_correct) === 1
        ).length;

      const score =
        total > 0
          ? Math.round(
              (correct / total) * 100
            )
          : 0;

      // =====================
      // AI FEEDBACK
      // =====================

      const feedback =
        await callHyperClova({
          systemPrompt:
            "You are Daesan AI.",

          userPrompt:
            buildFinalFeedbackPrompt({
              exerciseTotalQty:
                total,

              exerciseCorrectQty:
                correct,
            }),
        });

      // =====================
      // UPDATE SESSION
      // =====================

      await db.query(`
        UPDATE exercise_sessions
        SET
          correct_answers = ?,
          score = ?,
          final_feedback = ?,
          status = 'completed',
          completed_at = NOW()
        WHERE id = ?
      `, [
        correct,
        score,
        feedback,
        exercise_session_id,
      ]);

      return res.json({
        success: true,
        feedback,
        score,
        correct,
        total,
      });

    } catch (err) {

      console.error(
        "SUBMIT EXERCISE ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
      });
    }
  };