export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS stages (
      stage_code VARCHAR(2) PRIMARY KEY,
      stage_name VARCHAR(50) NOT NULL,
      skill_name VARCHAR(100) NOT NULL,
      focus_area VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE stages`);
};