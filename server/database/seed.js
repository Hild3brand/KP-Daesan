import db from "./db.js";

import rolesSeed from "./seeds/001_roles.seed.js";
import stagesSeed from "./seeds/002_stages.seed.js";
import usersSeed from "./seeds/003_users.seed.js";
import { seedQuestions } from "./seeds/004_pretest_questions.seed.js";
import { seedOptions } from "./seeds/005_pretest_options.seed.js";
import { seedMaterialChunks } from "./seeds/006_material_chunks.seed.js";
import seedQuizQuestions from "./seeds/007_quiz_question.seed.js"; 
import seedQuizOptions from "./seeds/008_quiz_options.seed.js";     

const runSeeds = async () => {
  try {
    console.log("Running seeders...");
    await rolesSeed(db);
    console.log("Roles seeded");
    await stagesSeed(db);
    console.log("Stages seeded");
    await usersSeed(db);
    console.log("Users seeded");
    const questionIds = await seedQuestions(db);
    console.log("Questions seeded");
    await seedOptions(db, questionIds);
    console.log("Options seeded");
    await seedMaterialChunks(db);
    console.log("Material chunks seeded");
    
    await seedQuizQuestions(db);
    console.log("Quiz questions seeded");
    
    await seedQuizOptions(db);
    console.log("Quiz options seeded");
    
    console.log("Seeder selesai");

    process.exit(0);

  } catch (err) {
    console.error("Seeder error:");
    console.error(err);

    process.exit(1);
  }
};

runSeeds();