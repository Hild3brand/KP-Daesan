import express from "express";

import { verifyToken }
from "../middlewares/verifyToken.js";

import {
  getStageAccess
} from "../controllers/stageLimiterController.js";

const router = express.Router();

router.get(
  "/access",
  verifyToken,
  getStageAccess
);

export default router;