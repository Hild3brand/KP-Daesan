import express from "express";

import {
  getStages,
} from "../controllers/stageController.js";

const router = express.Router();

router.get("/", getStages);

export default router;