export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS exercise_options (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

      question_id BIGINT UNSIGNED NOT NULL,

      option_key VARCHAR(10) NOT NULL,

      option_text TEXT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_exercise_options_question
        FOREIGN KEY (question_id)
        REFERENCES exercise_questions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `);
};

export const down = async (db) => {
  await db.execute(`
    DROP TABLE exercise_options
  `);
};