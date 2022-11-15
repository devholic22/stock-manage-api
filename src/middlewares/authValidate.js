import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );

    const { user_number, user_com } = req.decoded;
    const user = User.findByNumber(user_number);

    if (!user) {
      return res.json({
        error: "등록되지 않은 유저입니다."
      });
    }
    // 이진 탐색 가능하도록 하기 위함
    req.user = { user_number, user_com };

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
