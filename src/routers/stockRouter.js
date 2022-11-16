import { Router } from "express";
import { uploadStock } from "../controllers/stockController.js";

const router = Router();

router.post("/", uploadStock);

export default router;
