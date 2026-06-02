export const up = async (db) => {

  await db.query(`
    CREATE TABLE IF NOT EXISTS quiz_answers (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,

      session_id BIGINT(20) UNSIGNED NOT NULL,

      question_id BIGINT(20) UNSIGNED NOT NULL,

      user_answer VARCHAR(10) DEFAULT NULL,

      is_correct TINYINT(1) DEFAULT 0,

      answered_at TIMESTAMP NOT NULL
      DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (id),

      CONSTRAINT fk_quiz_answer_session
      FOREIGN KEY (session_id)
      REFERENCES quiz_sessions(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_quiz_answer_question
      FOREIGN KEY (question_id)
      REFERENCES quiz_questions(id)
      ON DELETE CASCADE

    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_general_ci;
  `);

};

export const down = async (db) => {

  await db.query(`
    DROP TABLE IF EXISTS quiz_answers;
  `);

};