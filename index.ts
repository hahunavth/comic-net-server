import { API_URL, PORT, SERVER_URL } from "./config.env.js";
import express from "express";
import cors from "cors";
import logger from "morgan";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import errorHandler from "./src/middleware/errorHandler.js";
import cache from "./src/middleware/cache.js";
import Router from "./src/routes/index.js";
import { checkDotEnv } from "./src/utils/index.js";

import mongoose from "mongoose";
import Task from "./src/services/update-db.js";

const app = express();

app.use(cors());
app.use(cache());
if(process.env.NODE_ENV !== 'test')
  app.use(logger("dev"));
app.use(errorHandler);
app.use(express.json());

// Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nettruyen CORS API",
      version: "0.1.0",
      description:
        "This is a simple API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "NetCORS",
        url: "https://github.com/hahunavth",
        email: "vuthanhha.2001@gmail.com",
      },
    },
    servers: [
      {
        url: SERVER_URL, // NOTE: config in server
      },
    ],
  },
  apis: [
    "./src/routes/index.ts",
    "./src/routes/index.js",
    "./dist/src/models/index.js",
  ],
};

const specs = swaggerJsDoc(options);

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(specs, { explorer: true })
);

// ===== App =====

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Server running in: " + SERVER_URL,
    info:
      "You can test api at: " + `https://hahunavth-express-api.heroku.com/docs`,
  })
);

app.use("/api/v1", Router);

//  ANCHOR: DB

async function main() {
  console.log("🚀🚀🚀 START");
  console.log("🚀🚀🚀 Connect DB");
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.auw0z.mongodb.net/${process.env.DB_NAME}`
    )
    .then(() => console.log("Success!"))
    .catch(() => console.log("Fail!!!"));

  // Cron task
  // NOTE: Disable for development
  // TODO: Find solution for save data online without quota
  // Task();

  // Express
  app.listen(PORT, () => {
    console.log("🚀🚀🚀 Listening at http://localhost:" + PORT);
  });
}

// RUN APPLICATION IF NOT ENV IS NOT TESTING
if(process.env.NODE_ENV !== 'test')
  main().catch((err) => console.log(err));

// For testing
export default app;
