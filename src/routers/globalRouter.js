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
import graphRouter from "../routers/graphRouter.js";

const router = Router();

router.get("/", authMiddleware, allStockOfUserCompany);
router.put("/", authMiddleware, editStock);

router.post("/signup/admin", postJoinAdmin);
router.post("/signup/user", postJoinUser);
router.post("/login", postLogin);
router.use("/stock", authMiddleware, stockRouter);
router.use("/notice", authMiddleware, noticeRouter);
router.use("/graph", authMiddleware, graphRouter);

export default router;
