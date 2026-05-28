import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database/db.js";
import { findUserById, updateRefreshToken } from "../models/userModel.js";

// ======================
// LOGIN
// ======================
export const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ message: "User tidak aktif" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Password salah" });
    }

    // access token
    const accessToken = jwt.sign(
      { 
        id: user.id,
        role_id: user.roles_id
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    console.log("USER:", user.roles_id);

    // refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // simpan ke DB
    await updateRefreshToken(user.id, refreshToken);

    res.json({
      message: "Login berhasil",
      accessToken,
      refreshToken
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================
// REFRESH TOKEN
// ======================
export const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    // cek token di DB
    const [rows] = await db.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) {
      return res.sendStatus(403);
    }

    // verify JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);

        // buat access token baru
        const accessToken = jwt.sign(
          { 
            id: user.id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.json({ accessToken });
      }
    );

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================
// LOGOUT
// ======================
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.sendStatus(204);
    }

    // cek apakah ada di DB
    const [rows] = await db.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) {
      return res.sendStatus(204);
    }

    // hapus token
    await db.query(
      "UPDATE users SET refresh_token = NULL WHERE refresh_token = ?",
      [refreshToken]
    );

    res.json({ message: "Logout berhasil" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};