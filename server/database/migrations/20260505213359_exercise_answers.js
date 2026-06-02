export const up = async (db) => {
  await db.execute(`
    CREATE TABLE exercise_answers (
      id INT AUTO_INCREMENT PRIMARY KEY,

      exercise_question_id INT NOT NULL,

      user_answer VARCHAR(1),
      is_correct BOOLEAN,

      insight TEXT NULL,
      tips TEXT NULL,

      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_exercise_answers_question
      FOREIGN KEY (exercise_question_id)
      REFERENCES exercise_questions(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE exercise_answers`);
};