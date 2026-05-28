export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_messages (
<<<<<<< Updated upstream
      id INT AUTO_INCREMENT PRIMARY KEY,

      user_id VARCHAR(7) NOT NULL,

      sender ENUM('user', 'ai') NOT NULL,
=======
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

      user_id VARCHAR(7) NOT NULL,

      sender ENUM(
        'user',
        'ai'
      ) NOT NULL,
>>>>>>> Stashed changes

      message_type ENUM(
        'chat',
        'overview',
<<<<<<< Updated upstream
        'exercise',
        'feedback'
      ) NOT NULL DEFAULT 'chat',

      message TEXT NOT NULL,

      createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_chat_messages_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    )
=======
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
>>>>>>> Stashed changes
  `);
};

export const down = async (db) => {
  await db.execute(`
    DROP TABLE IF EXISTS chat_messages
  `);
};