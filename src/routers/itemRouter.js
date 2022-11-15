import { Router } from "express";
import { uploadItem } from "../controllers/itemController.js";

const router = Router();

router.post("/", uploadItem);

export default router;
