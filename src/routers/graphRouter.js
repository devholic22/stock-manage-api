import { getGraph } from "../controllers/graphController.js";
import { Router } from "express";

const router = Router();

router.get("/", getGraph);

export default router;
