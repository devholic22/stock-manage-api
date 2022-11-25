import { Router } from "express";
import {
  allStockOfUserCompany,
  editStock
} from "../controllers/stockController.js";
import {
  postJoinAdmin,
  postJoinUser,
  postLogin
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authValidate.js";
import stockRouter from "../routers/stockRouter.js";
import noticeRouter from "../routers/noticeRouter.js";

const router = Router();

router.get("/", authMiddleware, allStockOfUserCompany);
router.put("/", authMiddleware, editStock);

router.post("/signup/admin", postJoinAdmin);
router.post("/signup/user", postJoinUser);
router.post("/login", postLogin);
router.use("/stock", authMiddleware, stockRouter);
router.use("/notice", authMiddleware, noticeRouter);

export default router;
