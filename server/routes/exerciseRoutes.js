import express from "express";

import {
  generateExercise,
  getExerciseSession,
  submitAnswer,
  submitExercise,
} from "../controllers/exerciseController.js";

import { verifyToken }
  from "../middlewares/verifyToken.js";

const router = express.Router();

router.post(
  "/generate",
  verifyToken,
  generateExercise
);

router.get(
  "/session/:id",
  verifyToken,
  getExerciseSession
);

router.post(
  "/submit-answer",
  verifyToken,
  submitAnswer
);

router.post(
  "/submit",
  verifyToken,
  submitExercise
);

export default router;