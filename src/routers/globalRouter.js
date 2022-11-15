import { Router } from "express";
import { allItemOfUserCompany } from "../controllers/itemController.js";
import {
  postJoinAdmin,
  postJoinUser,
  postLogin
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authValidate.js";
import itemRouter from "../routers/itemRouter.js";

const router = Router();

router.get("/", authMiddleware, allItemOfUserCompany);

router.post("/signup/admin", postJoinAdmin);
router.post("/signup/user", postJoinUser);
router.post("/login", postLogin);
router.use("/item", authMiddleware, itemRouter);

export default router;
