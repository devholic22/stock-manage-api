import { Router } from "express";
import { deleteNotice, uploadNotice } from "../controllers/noticeController.js";

const router = Router();

router.post("/", uploadNotice);
router.delete("/", deleteNotice);

export default router;
