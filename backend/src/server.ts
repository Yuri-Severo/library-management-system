import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();
const port = 3000;

app.use(cors({ origin: ["*"] }));

app.use(express.json());

app.use("/api", routes)

app.listen(port, () => console.log(`Listening in http://localhost:${port}/api`));