import db from "./db.js";

const migrations = [

  // =====================================
  // MASTER
  // =====================================

  "20260423093614_create_roles.js",
  "20260423093650_create_stages.js",
  "20260423093700_create_users.js",

  // =====================================
  // PRETEST
  // =====================================

  "20260423093751_create_pretest_results.js",
  "20260423093810_create_pretest_questions.js",
  "20260423093823_create_pretest_options.js",
  "20260423093832_create_pretest_answer.js",

  // =====================================
  // CHATBOT
  // =====================================

  "20260505213113_chat_messages.js",

  // =====================================
  // MATERIAL
  // =====================================

  "20260505213431_material_chunks.js",

  // =====================================
  // EXERCISE
  // =====================================

  "20260513175227_exercise_sessions.js",
  "20260513175317_exercise_questions.js",
  "20260513175330_exercise_options.js",
  "20260513175342_exercise_answers.js",

  // =====================================
  // QUIZ
  // =====================================

  "20260528154739_create_quiz_sessions_table.js",
  "20260528154746_create_quiz_questions_table.js",
  "20260528154751_create_quiz_options_table.js",
  "20260528154755_create_quiz_answers_table.js",

];

const run = async () => {

  try {

    console.log(
      "🚀 Starting migration...\n"
    );

    for (const file of migrations) {

      console.log(
        `▶ Running ${file}`
      );

      const migration =
        await import(
          `./migrations/${file}`
        );

      if (
        typeof migration.up !==
        "function"
      ) {

        throw new Error(
          `${file} does not export 'up()'`
        );
      }

      await migration.up(db);

      console.log(
        `✅ Done ${file}\n`
      );
    }

    console.log(
      "🎉 All migrations completed"
    );

    process.exit(0);

  } catch (err) {

    console.error(
      "\n❌ Migration error:"
    );

    console.error(
      err.message
    );

    process.exit(1);
  }
};

run();
