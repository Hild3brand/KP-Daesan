import express from "express";

import { verifyToken }
  from "../middlewares/verifyToken.js";

import {
  chat,
  generateExercise,
  generateExerciseFeedback,
  getChatHistory,
  generateOverview,
} from "../controllers/chatbotController.js";

const router =
  express.Router();

router.post(
  "/chat",
  verifyToken,
  chat
);

router.post(
  "/generate-exercise",
  verifyToken,
  generateExercise
);

router.post(
  "/exercise-feedback",
  verifyToken,
  generateExerciseFeedback
);

router.get(
  "/chat-history",
  verifyToken,
  getChatHistory
);

router.post(
  "/overview",
  verifyToken,
  generateOverview
);

export default router;