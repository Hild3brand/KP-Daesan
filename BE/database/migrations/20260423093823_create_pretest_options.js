export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pretest_options (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question_id INT NOT NULL,
      option_label CHAR(1) NOT NULL,
      option_text TEXT NOT NULL,

      CONSTRAINT fk_pretest_options_questions
        FOREIGN KEY (question_id)
        REFERENCES pretest_questions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE pretest_options`);
};