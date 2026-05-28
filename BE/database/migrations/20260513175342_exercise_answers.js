export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS exercise_answers (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

      session_id BIGINT UNSIGNED NOT NULL,

      question_id BIGINT UNSIGNED NOT NULL,

      user_id VARCHAR(7) NOT NULL,

      user_answer TEXT,

      is_correct BOOLEAN DEFAULT FALSE,

      ai_feedback TEXT NULL,

      answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_exercise_answers_session
        FOREIGN KEY (session_id)
        REFERENCES exercise_sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

      CONSTRAINT fk_exercise_answers_question
        FOREIGN KEY (question_id)
        REFERENCES exercise_questions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

      CONSTRAINT fk_exercise_answers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

    ) ENGINE=InnoDB;
  `);
};

export const down = async (db) => {
  await db.execute(`
    DROP TABLE IF EXISTS exercise_answers
  `);
};