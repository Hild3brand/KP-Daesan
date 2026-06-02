export const up = async (db) => {

  await db.query(`
    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,

      user_id VARCHAR(7) NOT NULL,

      stage_code VARCHAR(2) NOT NULL,

      total_questions INT(11) DEFAULT 0,

      correct_answers INT(11) DEFAULT 0,

      score INT(11) DEFAULT 0,

      status ENUM(
        'in_progress',
        'completed'
      ) DEFAULT 'in_progress',

      started_at TIMESTAMP NOT NULL
      DEFAULT CURRENT_TIMESTAMP,

      completed_at TIMESTAMP NULL DEFAULT NULL,

      PRIMARY KEY (id)

    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_general_ci;
  `);

};

export const down = async (db) => {

  await db.query(`
    DROP TABLE IF EXISTS quiz_sessions;
  `);

};