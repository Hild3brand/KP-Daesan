export const up = async (db) => {

  await db.execute(`
    CREATE TABLE IF NOT EXISTS exercise_questions (

      id BIGINT UNSIGNED
      PRIMARY KEY AUTO_INCREMENT,

      exercise_session_id BIGINT UNSIGNED NOT NULL,

      question_code VARCHAR(50),

      question_type VARCHAR(50),

      question_text TEXT,

      correct_answer TEXT,

      mastery_if_correct TEXT NULL,

      error_profile_if_wrong TEXT NULL,

      question_order INT,

      created_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_exercise_questions_session
        FOREIGN KEY (exercise_session_id)
        REFERENCES exercise_sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

    ) ENGINE=InnoDB;
  `);

};

export const down = async (db) => {

  await db.execute(`
    DROP TABLE IF EXISTS exercise_questions
  `);

};