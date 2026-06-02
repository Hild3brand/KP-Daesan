export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pretest_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(7) NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_pretest_results_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE pretest_results`);
};