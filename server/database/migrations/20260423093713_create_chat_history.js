export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('Overview Materi','Exercise') NOT NULL,
      user_prompt TEXT NOT NULL,
      system_response TEXT NOT NULL,
      users_id VARCHAR(7) NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_chat_history_users
        FOREIGN KEY (users_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE chat_history`);
};