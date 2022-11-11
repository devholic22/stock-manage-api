import { Router } from "express";
import {
  postJoinAdmin,
  postJoinUser,
  postLogin
} from "../controllers/userController.js";

const router = Router();

router.get("/", (req, res) => {
  return res.send("api server");
});

router.post("/signup/admin", postJoinAdmin);
router.post("/signup/user", postJoinUser);
router.post("/login", postLogin);

export default router;
