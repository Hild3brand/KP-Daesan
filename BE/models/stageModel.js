import db from "../database/db.js";

export const getAllStages = async () => {

  const [rows] = await db.query(`
    SELECT
      stage_code,
      stage_name,
      skill_name,
      focus_area
    FROM stages
    ORDER BY stage_code ASC
  `);

  return rows;
};