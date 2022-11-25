import Stock from "../models/Stock.js";

export const getGraph = (req, res) => {
  const { user } = req;
  const { type, stock } = req.query;
  const { user_com } = user;
  const targetStock = Stock.findByNumber(user_com, type, stock);
  if (!targetStock) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  return res.json(targetStock.graph);
};
