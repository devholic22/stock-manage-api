import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    const { number } = req.decoded;

    const user = User.findByNumber(number);

    if (!user) {
      return res.json({
        error: "등록되지 않은 유저입니다."
      });
    }
    // 이진 탐색 가능하도록 하기 위함
    req.user = number;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.json({
        error: "인증이 만료되었습니다."
      });
    }
    return res.json({
      error: "로그인이 필요합니다."
    });
  }
};

export default authMiddleware;
