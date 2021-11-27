import express from "express";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import errorHandler from "./src/middlewares/errorHandler.js";
import cache from "./src/middlewares/cache.js";
import Router from "./src/routes/index.js";
import { checkDotEnv } from "./src/utils/index.js";

dotenv.config();
checkDotEnv();

const app = express();
const PORT = process.env.PORT || 8000;
console.log("🚀 ~ file: index.js ~ line 17 ~ PORT", PORT);

app.use(cors());
app.use(cache());
app.use(logger("dev"));
app.use(errorHandler);
app.use(bodyParser.json());

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Server runing in: http://localhost:" + PORT,
  })
);

app.use("/api/v1", Router);

app.listen(PORT, () => {
  console.log("Listening at http://localhost:" + PORT);
});
