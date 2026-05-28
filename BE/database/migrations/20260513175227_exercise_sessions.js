export const up = async (db) => {

  await db.execute(`
    CREATE TABLE IF NOT EXISTS exercise_sessions (

      id BIGINT UNSIGNED
      PRIMARY KEY AUTO_INCREMENT,

      user_id VARCHAR(7) NOT NULL,

      stage_code VARCHAR(50),

      total_questions INT DEFAULT 0,

      correct_answers INT DEFAULT 0,

      score INT DEFAULT 0,

      status ENUM(
        'in_progress',
        'completed'
      ) DEFAULT 'in_progress',

      final_feedback LONGTEXT NULL,

      created_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP,

      completed_at TIMESTAMP NULL,

      CONSTRAINT fk_exercise_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

    ) ENGINE=InnoDB;
  `);

};

export const down = async (db) => {

  await db.execute(`
    DROP TABLE IF EXISTS exercise_sessions
  `);

};