export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(45) NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE roles`);
};