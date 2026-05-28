import db from "../database/db.js";

export const findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const createUser = async (data) => {
  const { id, name, password, status, roles_id, stage_code } = data;

  await db.query(
    `INSERT INTO users 
     (id, name, password, status, roles_id, stage_code, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [id, name, password, status, roles_id, stage_code]
  );
};

export const updateRefreshToken = async (id, token) => {
  await db.query(
    "UPDATE users SET refresh_token = ? WHERE id = ?",
    [token, id]
  );
};