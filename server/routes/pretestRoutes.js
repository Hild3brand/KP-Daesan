import express from "express";
import { getPretest, submitPretest, checkPretest, getPretestResult } from "../controllers/pretestController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getPretest);
router.get("/check", verifyToken, checkPretest);
router.get("/result", verifyToken, getPretestResult);
router.post("/submit", verifyToken, submitPretest);

export default router;