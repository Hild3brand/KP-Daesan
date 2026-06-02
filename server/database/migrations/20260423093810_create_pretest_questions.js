export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pretest_questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      stage_code VARCHAR(2) NOT NULL,
      question_number INT NOT NULL,
      question_text TEXT NOT NULL,
      correct_answer VARCHAR(1) NOT NULL,
      error_correct TEXT NOT NULL,
      error_wrong TEXT NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_pretest_questions_stages
        FOREIGN KEY (stage_code)
        REFERENCES stages(stage_code)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE pretest_questions`);
};