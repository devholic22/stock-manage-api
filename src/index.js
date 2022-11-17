import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createConnection } from "./models/index.js";
import globalRouter from "./routers/globalRouter.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

createConnection();

app.use(
  cors({
    origin: ["http://localhost:3000"]
  })
);
app.use(globalRouter);

const handleListen = () => {
  console.log(`✅ Server listening at: http://localhost:${PORT}`);
};

app.listen(PORT, handleListen);
