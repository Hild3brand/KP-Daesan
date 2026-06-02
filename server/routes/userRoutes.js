// src/routes/userRoutes.js

import express from "express";

import {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/userController.js";

import {
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

/* REGISTER */
router.post(
  "/register",
  registerUser
);

/* GET ALL USERS */
router.get(
  "/",
  verifyToken,
  getUsers
);

/* GET ME */
router.get(
  "/me",
  verifyToken,
  getMe
);

/* GET USER BY ID */
router.get(
  "/:id",
  verifyToken,
  getUserById
);

/* UPDATE USER */
router.put(
  "/:id",
  verifyToken,
  updateUser
);

/* DELETE USER */
router.delete(
  "/:id",
  verifyToken,
  deleteUser
);

export default router;