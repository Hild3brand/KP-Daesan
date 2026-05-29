export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

      user_id VARCHAR(7) NOT NULL,

      sender ENUM(
        'user',
        'ai'
      ) NOT NULL,

      message_type ENUM(
        'chat',
        'overview',
        'exercise'
      ) DEFAULT 'text',

      message LONGTEXT,

      exercise_session_id BIGINT UNSIGNED NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_chat_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

    ) ENGINE=InnoDB;
  `);
};

export const down = async (db) => {
  await db.execute(`
    DROP TABLE IF EXISTS chat_messages
  `);
};