import db from "./db.js";

const migrations = [
  "20260423093614_create_roles.js",
  "20260423093650_create_stages.js",
  "20260423093700_create_users.js",

  // PRETEST
  "20260423093751_create_pretest_results.js",
  "20260423093810_create_pretest_questions.js",
  "20260423093823_create_pretest_options.js",
  "20260423093832_create_pretest_answer.js",

  // CHATBOT
  "20260505213113_chat_messages.js",

  // // EXERCISE
  // "20260505213230_exercise_sessions.js",
  // "20260505213258_exercise_questions.js",
  // "20260505213327_exercise_options.js",
  // "20260505213359_exercise_answers.js",

  // MATERIAL
  "20260505213431_material_chunks.js",
  // HISTORY
  "20260513175227_exercise_sessions.js",
  "20260513175317_exercise_questions.js",
  "20260513175330_exercise_options.js",
  "20260513175342_exercise_answers.js",
];

const run = async () => {
  try {
    console.log("🚀 Starting migration...\n");

    for (const file of migrations) {
      console.log(`▶ Running ${file}`);

      const migration = await import(`./migrations/${file}`);

      if (typeof migration.up !== "function") {
        throw new Error(`${file} does not export 'up()'`);
      }

      await migration.up(db);

      console.log(`✅ Done ${file}\n`);
    }

    console.log("🎉 All migrations completed");
    process.exit(0);

  } catch (err) {
    console.error("\n❌ Migration error:");
    console.error(err.message);
    process.exit(1);
  }
};

run();