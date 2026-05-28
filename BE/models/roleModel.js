import db from "../database/db.js";

export const getAllRoles = async () => {
  const [rows] = await db.query(`
    SELECT id, name
    FROM roles
  `);

  return rows;
};