export const up = async (db) => {
  await db.execute(`
    CREATE TABLE exercise_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,

      chat_message_id INT NOT NULL,

      stage_code VARCHAR(2),
      skill_name VARCHAR(100),

      score INT DEFAULT 0,
      total_questions INT DEFAULT 0,

      ai_feedback LONGTEXT NULL,

      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_exercise_sessions_message
      FOREIGN KEY (chat_message_id)
      REFERENCES chat_messages(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE exercise_sessions`);
};