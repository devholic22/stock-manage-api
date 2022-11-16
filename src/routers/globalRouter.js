import { Router } from "express";
import { allStockOfUserCompany } from "../controllers/stockController.js";
import {
  postJoinAdmin,
  postJoinUser,
  postLogin
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authValidate.js";
import stockRouter from "../routers/stockRouter.js";

const router = Router();

router.get("/", authMiddleware, allStockOfUserCompany);

router.post("/signup/admin", postJoinAdmin);
router.post("/signup/user", postJoinUser);
router.post("/login", postLogin);
router.use("/stock", authMiddleware, stockRouter);

export default router;
