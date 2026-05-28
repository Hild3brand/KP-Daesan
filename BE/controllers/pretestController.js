import db from "../database/db.js";

/* =========================
   GET PRETEST QUESTIONS
========================= */
export const getPretest = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        q.id,
        q.question_text,
        o.option_label,
        o.option_text
      FROM pretest_questions q
      JOIN pretest_options o ON q.id = o.question_id
      ORDER BY q.question_number ASC
    `);

    // grouping
    const map = {};

    rows.forEach((row) => {
      if (!map[row.id]) {
        map[row.id] = {
          id: row.id,
          question: row.question_text,
          options: [],
        };
      }

      map[row.id].options.push({
        label: row.option_label,
        text: row.option_text,
      });
    });

    const result = Object.values(map);

    res.json(result);

  } catch (err) {
    console.error("GET PRETEST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CHECK PRETEST
========================= */
export const checkPretest = async (req, res) => {
  try {
    const userId = req.userId; // 🔥 FIX DI SINI

    const [rows] = await db.query(
      "SELECT id FROM pretest_results WHERE user_id = ?",
      [userId]
    );

    res.json({
      hasPretest: rows.length > 0,
    });

  } catch (err) {
    console.error("CHECK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   SUBMIT PRETEST
========================= */
export const submitPretest = async (req, res) => {
  const { answers } = req.body;
  const userId = req.userId; // 🔥 aman

  try {
    if (!answers) {
      return res.status(400).json({ message: "Answers kosong" });
    }

    const [existing] = await db.query(
      "SELECT id FROM pretest_results WHERE user_id = ?",
      [userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Pretest hanya boleh 1x",
      });
    }

    const [result] = await db.query(
      "INSERT INTO pretest_results (user_id, createdAt) VALUES (?, NOW())",
      [userId]
    );

    const resultId = result.insertId;

    const [questions] = await db.query(
      "SELECT id, correct_answer FROM pretest_questions"
    );

    const qMap = {};
    questions.forEach((q) => {
      qMap[q.id] = q.correct_answer;
    });

    let correct = 0;

    for (let qid in answers) {
      const qidNum = parseInt(qid);
      const userAnswer = answers[qid];
      const correctAnswer = qMap[qidNum];

      if (!correctAnswer) continue;

      const isCorrect = userAnswer === correctAnswer ? 1 : 0;
      if (isCorrect) correct++;

      await db.query(
        `INSERT INTO pretest_answers 
        (pretest_results_id, questions_id, user_answer, is_correct)
        VALUES (?, ?, ?, ?)`,
        [resultId, qidNum, userAnswer, isCorrect]
      );
    }

    const total = Object.keys(answers).length;
    const score = (correct / total) * 100;

    res.json({
      message: "Pretest selesai",
      score,
    });

  } catch (err) {
    console.error("🔥 ERROR SUBMIT:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET PRETEST RESULT
========================= */
export const getPretestResult = async (req, res) => {
  try {
    const userId = req.userId;

    const [[result]] = await db.query(
      `SELECT id FROM pretest_results 
       WHERE user_id = ? 
       ORDER BY id DESC LIMIT 1`,
      [userId]
    );

    if (!result) {
      return res.json({ done: false });
    }

    const [answers] = await db.query(
      `SELECT 
        pq.stage_code,
        pa.is_correct
      FROM pretest_answers pa
      JOIN pretest_questions pq ON pa.questions_id = pq.id
      WHERE pa.pretest_results_id = ?`,
      [result.id]
    );

    const total = answers.length;
    const correct = answers.filter(a => a.is_correct).length;
    const score = (correct / total) * 100;

    const stageScore = {};

    answers.forEach((a) => {
      if (!stageScore[a.stage_code]) {
        stageScore[a.stage_code] = { total: 0, correct: 0 };
      }

      stageScore[a.stage_code].total++;
      if (a.is_correct) stageScore[a.stage_code].correct++;
    });

    res.json({
      done: true,
      total,
      correct,
      score,
      stageScore,
    });

  } catch (err) {
    console.error("RESULT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};