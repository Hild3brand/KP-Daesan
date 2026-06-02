export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pretest_answers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pretest_results_id INT NOT NULL,
      questions_id INT NOT NULL,
      user_answer VARCHAR(1) NOT NULL,
      is_correct TINYINT NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_pretest_answers_results
        FOREIGN KEY (pretest_results_id)
        REFERENCES pretest_results(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

      CONSTRAINT fk_pretest_answers_questions
        FOREIGN KEY (questions_id)
        REFERENCES pretest_questions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE pretest_answers`);
};