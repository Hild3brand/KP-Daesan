import bcrypt from "bcrypt";
import db from "../database/db.js";
import { createUser, findUserById } from "../models/userModel.js";

// REGISTER
export const registerUser = async (req, res) => {
  const { id, name, password, roles_id, stage_code } = req.body;

  try {
    const existing = await findUserById(id);
    if (existing) {
      return res.status(400).json({ message: "User sudah ada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      id,
      name,
      password: hashedPassword,
      status: "Active",
      roles_id,
      stage_code
    });

    res.status(201).json({ message: "User berhasil dibuat" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          u.id,
          u.name,
          r.id AS role_id,
          r.name AS role_name,
          s.stage_code,
          s.stage_name
      FROM users u
      LEFT JOIN roles r ON u.roles_id = r.id
      LEFT JOIN stages s ON u.stage_code = s.stage_code
      WHERE u.id = ?`,
      [req.userId]
    );

    console.log(rows);
    console.log(req.userId);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        u.id,
        u.name,
        u.status,

        r.id AS role_id,
        r.name AS role_name,

        s.stage_code,
        s.stage_name

      FROM users u

      JOIN roles r
        ON u.roles_id = r.id

      JOIN stages s
        ON u.stage_code = s.stage_code

      ORDER BY u.id ASC
    `);

    res.json(rows);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {

    const [rows] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.status,

        r.id AS role_id,
        r.name AS role_name,

        s.stage_code,
        s.stage_name

      FROM users u

      JOIN roles r
        ON u.roles_id = r.id

      JOIN stages s
        ON u.stage_code = s.stage_code

      WHERE u.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    roles_id,
    stage_code,
    status,
  } = req.body;

  try {

    const [existing] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        roles_id = ?,
        stage_code = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name,
        roles_id,
        stage_code,
        status,
        id,
      ]
    );

    res.json({
      message: "User berhasil diupdate",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {

    const [existing] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await db.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    res.json({
      message: "User berhasil dihapus",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
