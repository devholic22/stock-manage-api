import { Router } from "express";
import {
  addStock,
  editHistory,
  uploadStock
} from "../controllers/stockController.js";

const router = Router();

router.post("/", uploadStock);
router.post("/history", addStock);
router.put("/history", editHistory);

export default router;
