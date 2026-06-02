export const up = async (db) => {

  await db.query(`
    CREATE TABLE IF NOT EXISTS quiz_options (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,

      question_id BIGINT(20) UNSIGNED NOT NULL,

      option_key VARCHAR(10) NOT NULL,

      option_text TEXT NOT NULL,

      created_at TIMESTAMP NOT NULL
      DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (id),

      CONSTRAINT fk_quiz_option_question
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
    DROP TABLE IF EXISTS quiz_options;
  `);

};