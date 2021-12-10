import { API_URL, PORT, SERVER_URL } from "./config.env.js";
import express from "express";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import errorHandler from "./src/middleware/errorHandler.js";
import cache from "./src/middleware/cache.js";
import Router from "./src/routes/index.js";
import { checkDotEnv } from "./src/utils/index.js";

// import "./src/routes/books.js";

const app = express();

app.use(cors());
app.use(cache());
app.use(logger("dev"));
app.use(errorHandler);
app.use(bodyParser.json());

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
        url: 'https://github.com/hahunavth',
        email: 'vuthanhha.2001@gmail.com',
      },
    },
    servers: [
      {
        url: SERVER_URL,    // NOTE: config in server
      },
    ],
  },
  apis: ["./src/routes/index.ts", "./src/routes/index.js", './dist/src/models/index.js'],
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
    message: "Server running in: " + SERVER_URL ,
    info: "You can test api at: " + `https://hahunavth-express-api.heroku.com/docs`
  })
);

app.use("/api/v1", Router);

app.listen(PORT, () => {
  console.log("🚀🚀🚀 Listening at http://localhost:" + PORT);
});
