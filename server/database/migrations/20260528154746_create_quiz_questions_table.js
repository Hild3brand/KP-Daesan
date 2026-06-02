export const up = async (db) => {

  await db.query(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,

      stage_code VARCHAR(2) NOT NULL,

      material_code VARCHAR(20) NOT NULL,

      question_text TEXT NOT NULL,

      question_type ENUM(
        'multiple_choice'
      ) DEFAULT 'multiple_choice',

      correct_answer VARCHAR(10) NOT NULL,

      question_order INT(11) DEFAULT 0,

      created_at TIMESTAMP NOT NULL
      DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (id)

    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_general_ci;
  `);

};

export const down = async (db) => {

  await db.query(`
    DROP TABLE IF EXISTS quiz_questions;
  `);

};