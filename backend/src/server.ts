import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { env } from "./config/env.config";

const app = express();

app.use(cors({ origin: ["*"] }));

app.use(express.json());

app.use("/api", routes);

app.listen(env.PORT, () =>
  console.log(`Listening in http://localhost:${env.PORT}/api`)
);
