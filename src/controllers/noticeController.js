import Notice from "../models/Notice.js";
import User from "../models/User.js";

export const uploadNotice = async (req, res) => {
  const { user } = req;
  const { user_number, user_com } = user;
  const { title, content } = req.body;
  const owner = User.findByNumber(user_number);
  if (owner.role !== "admin") {
    return res.json({
      error: "권한이 없습니다."
    });
  }
  const notice = await Notice.create(title, content, user_number, user_com);
  return res.json(notice);
};
export const deleteNotice = async (req, res) => {
  const { user } = req;
  const { user_number, user_com } = user;
  const owner = User.findByNumber(user_number);
  if (owner.role !== "admin") {
    return res.json({
      error: "권한이 없습니다."
    });
  }
  const notice = await Notice.shift(user_com);
  return res.json(notice);
};
