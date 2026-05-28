import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import stageRoutes from "./routes/stageRoutes.js";
import pretestRoutes from "./routes/pretestRoutes.js";

import chatbotRoutes from "./routes/chatbotRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";

import stageLimiterRoutes from "./routes/stageLimiterRoutes.js";

import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pretest", pretestRoutes);

app.use("/api/bot", chatbotRoutes);
app.use("/api/exercise", exerciseRoutes);

app.use("/api/roles", roleRoutes);
app.use("/api/stages", stageRoutes);

app.use("/api/quiz", quizRoutes);
app.use("/api/stage", stageLimiterRoutes);

app.get("/", (req, res) => {
  res.send(
    `API running at ${req.protocol}://${req.get("host")}`
  );
});

(async () => {

  try {

    await db.query("SELECT 1");

    console.log(
      `=== Database connected === ${process.env.DB_NAME} @ ${process.env.DB_HOST} ===`
    );

  } catch (err) {

    console.error(
      "=== Database error: ",
      err.message,
      " ==="
    );
  }

})();

app.listen(process.env.PORT, () => {

  console.log(
    `Server running di port ${process.env.PORT}`
  );

});