import db from "../database/db.js";

export const getStageAccess = async (req, res) => {

  try {

    const userId = req.userId;

    /*
      =========================
      GET USER STAGE
      =========================
    */

    const [userRows] = await db.query(`
      SELECT stage_code
      FROM users
      WHERE id = ?
    `, [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    const currentStage = userRows[0].stage_code;

    /*
      =========================
      PRETEST SCORE
      =========================
    */

    const [pretestRows] = await db.query(`
      SELECT score
      FROM pretest_results
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 1
    `, [userId]);

    const pretestScore =
      pretestRows.length > 0
        ? pretestRows[0].score
        : null;

    /*
      =========================
      EXERCISE SCORE
      =========================
    */

    const [exerciseRows] = await db.query(`
      SELECT score
      FROM exercise_sessions
      WHERE user_id = ?
      AND stage_code = ?
      AND status = 'completed'
      ORDER BY id DESC
      LIMIT 1
    `, [userId, currentStage]);

    const exerciseScore =
      exerciseRows.length > 0
        ? exerciseRows[0].score
        : null;

    /*
      =========================
      QUIZ SCORE
      =========================
    */

    const [quizRows] = await db.query(`
      SELECT score
      FROM quiz_sessions
      WHERE user_id = ?
      AND stage_code = ?
      AND status = 'completed'
      ORDER BY id DESC
      LIMIT 1
    `, [userId, currentStage]);

    const quizScore =
      quizRows.length > 0
        ? quizRows[0].score
        : null;

    /*
      =========================
      FLOW LIMITER
      =========================
    */

    let access = {
      pretest: true,
      overview: false,
      exercise: false,
      quiz: false,
      nextStage: false
    };

    /*
      PRETEST BELUM ADA
    */

    if (pretestScore === null) {

      return res.json({
        currentStage,
        scores: {
          pretest: null,
          exercise: null,
          quiz: null
        },
        access
      });

    }

    /*
      PRETEST
    */

    if (pretestScore > 85) {

      access.exercise = true;

    } else {

      access.overview = true;
      access.exercise = true;

    }

    /*
      EXERCISE
    */

    if (
      exerciseScore !== null &&
      exerciseScore >= 80
    ) {
      access.quiz = true;
    }

    /*
      QUIZ
    */

    if (
      quizScore !== null &&
      quizScore >= 80
    ) {
      access.nextStage = true;
    }

    return res.json({
      currentStage,

      scores: {
        pretest: pretestScore,
        exercise: exerciseScore,
        quiz: quizScore
      },

      access
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: "Internal server error"
    });

  }

};