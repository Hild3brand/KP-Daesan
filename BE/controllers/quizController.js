import db from "../database/db.js";

// ======================================
// STAGE ORDER
// ======================================

const stages = [

  "R1",
  "R2",
  "R3",
  "R4",

  "U1",
  "U2",
  "U3",
  "U4",
  "U5",

  "A1",
  "A2",
  "A3",

];

// ======================================
// GET NEXT STAGE
// ======================================

const getNextStage = (
  currentStage
) => {

  const currentIndex =
    stages.indexOf(
      currentStage
    );

  // jika sudah stage terakhir
  // tetap di stage sekarang

  if (
    currentIndex === -1 ||
    currentIndex ===
    stages.length - 1
  ) {

    return currentStage;
  }

  return stages[
    currentIndex + 1
  ];
};

// ======================================
// START QUIZ
// ======================================

export const startQuiz = async (
  req,
  res
) => {

  try {

    const userId =
      req.userId;

    // ======================================
    // GET USER STAGE
    // ======================================

    const [userRows] =
      await db.query(
        `
        SELECT stage_code
        FROM users
        WHERE id = ?
        `,
        [userId]
      );

    if (
      !userRows.length
    ) {

      return res
        .status(404)
        .json({
          message:
            "User not found"
        });
    }

    const stageCode =
      userRows[0]
        .stage_code;

    // ======================================
    // GET QUESTIONS
    // ======================================

    const [questions] =
      await db.query(
        `
        SELECT *
        FROM quiz_questions
        WHERE stage_code = ?
        ORDER BY RAND()
        LIMIT 10
        `,
        [stageCode]
      );

    // ======================================
    // GET OPTIONS
    // ======================================

    for (const q of questions) {

      const [options] =
        await db.query(
          `
          SELECT
            option_key,
            option_text
          FROM quiz_options
          WHERE question_id = ?
          `,
          [q.id]
        );

      q.options = options;
    }

    // ======================================
    // CREATE SESSION
    // ======================================

    const [session] =
      await db.query(
        `
        INSERT INTO quiz_sessions
        (
          user_id,
          stage_code,
          total_questions,
          status
        )
        VALUES (?, ?, ?, 'ongoing')
        `,
        [
          userId,
          stageCode,
          questions.length
        ]
      );

    res.json({

      sessionId:
        session.insertId,

      stageCode,

      questions

    });

  } catch (error) {

    console.log(
      "START QUIZ ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Start quiz failed"
    });
  }
};

// ======================================
// SUBMIT QUIZ
// ======================================

export const submitQuiz = async (
  req,
  res
) => {

  try {

    const userId =
      req.userId;

    const {
      sessionId,
      answers
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!sessionId) {

      return res
        .status(400)
        .json({
          message:
            "Session ID required"
        });
    }

    if (!answers) {

      return res
        .status(400)
        .json({
          message:
            "Answers required"
        });
    }

    // ======================================
    // GET SESSION
    // ======================================

    const [sessionRows] =
      await db.query(
        `
        SELECT *
        FROM quiz_sessions
        WHERE id = ?
        AND user_id = ?
        `,
        [
          sessionId,
          userId
        ]
      );

    if (
      !sessionRows.length
    ) {

      return res
        .status(404)
        .json({
          message:
            "Quiz session not found"
        });
    }

    const session =
      sessionRows[0];

    // ======================================
    // PREVENT DOUBLE SUBMIT
    // ======================================

    if (
      session.status ===
      "completed"
    ) {

      return res
        .status(400)
        .json({
          message:
            "Quiz already completed"
        });
    }

    let correct = 0;

    // ======================================
    // CHECK ANSWERS
    // ======================================

    for (
      const questionId
      in answers
    ) {

      const userAnswer =
        answers[
          questionId
        ];

      const [rows] =
        await db.query(
          `
          SELECT correct_answer
          FROM quiz_questions
          WHERE id = ?
          `,
          [questionId]
        );

      if (!rows.length)
        continue;

      const isCorrect =
        rows[0]
          .correct_answer ===
        userAnswer;

      if (isCorrect)
        correct++;

      // ======================================
      // SAVE ANSWER
      // ======================================

      await db.query(
        `
        INSERT INTO quiz_answers
        (
          session_id,
          question_id,
          user_answer,
          is_correct
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          sessionId,
          questionId,
          userAnswer,
          isCorrect
        ]
      );
    }

    // ======================================
    // SCORE
    // ======================================

    const totalQuestions =
      session.total_questions || 10;

    const score =
      Math.round(
        (
          correct /
          totalQuestions
        ) * 100
      );

    // ======================================
    // UPDATE SESSION
    // ======================================

    await db.query(
      `
      UPDATE quiz_sessions
      SET
        correct_answers = ?,
        score = ?,
        status = 'completed',
        completed_at = NOW()
      WHERE id = ?
      `,
      [
        correct,
        score,
        sessionId
      ]
    );

    // ======================================
    // STAGE UP
    // ======================================

    let nextStage =
      session.stage_code;

    let stageUp =
      false;

    if (score >= 80) {

      nextStage =
        getNextStage(
          session.stage_code
        );

      // update jika beda
      // artinya naik stage

      if (
        nextStage !==
        session.stage_code
      ) {

        await db.query(
          `
          UPDATE users
          SET stage_code = ?
          WHERE id = ?
          `,
          [
            nextStage,
            userId
          ]
        );

        stageUp = true;
      }
    }

    // ======================================
    // RESPONSE
    // ======================================

    res.json({

      success: true,

      score,

      correct,

      totalQuestions,

      previousStage:
        session.stage_code,

      nextStage,

      stageUp,

      message:
        stageUp
          ? `Selamat! Anda naik stage ke ${nextStage}`
          : "Quiz selesai"

    });

  } catch (error) {

    console.log(
      "SUBMIT QUIZ ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Submit quiz failed"
    });
  }
};

// ======================================
// GET LIMITER
// ======================================

export const getLimiter = async (
  req,
  res
) => {

  try {

    const userId =
      req.userId;

    // ======================================
    // PRETEST SCORE
    // ======================================

    const [pretestRows] =
      await db.query(
        `
        SELECT score
        FROM pretest_results
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [userId]
      );

    // ======================================
    // EXERCISE SCORE
    // ======================================

    const [exerciseRows] =
      await db.query(
        `
        SELECT score
        FROM exercise_sessions
        WHERE user_id = ?
        AND status = 'completed'
        ORDER BY id DESC
        LIMIT 1
        `,
        [userId]
      );

    const pretestScore =
      pretestRows.length > 0
        ? pretestRows[0].score
        : 0;

    const exerciseScore =
      exerciseRows.length > 0
        ? exerciseRows[0].score
        : 0;

    res.json({

      pretestScore,

      exerciseScore

    });

  } catch (error) {

    console.log(
      "GET LIMITER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Get limiter failed"
    });
  }
};