export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ai_response TEXT NOT NULL,
      chat_history_id INT NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_feedbacks_chat_history
        FOREIGN KEY (chat_history_id)
        REFERENCES chat_history(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE feedbacks`);
};