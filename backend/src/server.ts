import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { env } from "./config/env.config";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger.json";

const app = express();

/* Middlewares */
app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors({ origin: ["*"] }));

app.use(express.json());

app.use("/api", routes);

app.listen(env.PORT, () =>
  console.log(`Listening in http://localhost:${env.PORT}/api`)
);
