export const up = async (db) => {
  await db.execute(`
    CREATE TABLE material_chunks (
      code VARCHAR(20) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type ENUM('concept', 'example', 'rule', 'dialogue', 'exercise', 'vocabulary') NOT NULL,
      content LONGTEXT NOT NULL,
      stage_code VARCHAR(2) NOT NULL,

      createdAt TIMESTAMP NULL DEFAULT NULL,
      updatedAt TIMESTAMP NULL DEFAULT NULL,

      CONSTRAINT fk_material_chunks_stage
      FOREIGN KEY (stage_code)
      REFERENCES stages(stage_code)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE material_chunks`);
};