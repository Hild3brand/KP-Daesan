export const up = async (db) => {
  await db.execute(`
    CREATE TABLE exercise_options (
      id INT AUTO_INCREMENT PRIMARY KEY,

      exercise_question_id INT NOT NULL,

      option_key VARCHAR(1) NOT NULL,
      option_text TEXT NOT NULL,

      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_exercise_options_question
      FOREIGN KEY (exercise_question_id)
      REFERENCES exercise_questions(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE exercise_options`);
};