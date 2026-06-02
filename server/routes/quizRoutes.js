import express from "express";

import {
  startQuiz,
  submitQuiz,
  getLimiter
} from "../controllers/quizController.js";

import {
  verifyToken
} from "../middlewares/verifyToken.js";

const router = express.Router();

router.post(
  "/start",
  verifyToken,
  startQuiz
);

router.post(
  "/submit",
  verifyToken,
  submitQuiz
);

router.get(
  "/limiter",
  verifyToken,
  getLimiter
);

export default router;