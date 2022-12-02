import { Router } from "express";
import {
  addStock,
  editHistory,
  editStock,
  getEditPage,
  uploadStock
} from "../controllers/stockController.js";

const router = Router();

router.post("/", uploadStock);
router.post("/history", addStock);
router.put("/history", editHistory);
router.get("/edit", getEditPage);
router.put("/edit", editStock);

export default router;
