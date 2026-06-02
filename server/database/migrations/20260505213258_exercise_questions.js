export const up = async (db) => {
  await db.execute(`
    CREATE TABLE exercise_questions (
      id INT AUTO_INCREMENT PRIMARY KEY,

      exercise_session_id INT NOT NULL,

      question_text TEXT NOT NULL,
      correct_answer VARCHAR(1) NOT NULL,

      question_order INT NOT NULL,

      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_exercise_questions_session
      FOREIGN KEY (exercise_session_id)
      REFERENCES exercise_sessions(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    );
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE exercise_questions`);
};