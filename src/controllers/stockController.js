import Stock from "../models/Stock.js";

export const uploadStock = async (req, res) => {
  const { type, origin, name, size, unit, price } = req.body;
  const stocksOfUserCompany = Stock.findByCompany(req.user.user_com);

  for (const stock of stocksOfUserCompany) {
    if (stock.name === name) {
      return res.json({
        error: "이미 등록되어 있는 제품입니다."
      });
    }
  }

  const stock = await Stock.create(
    type,
    origin,
    name,
    size,
    unit,
    price,
    req.user.user_com
  );

  return res.json(stock);
};

export const allStockOfUserCompany = (req, res) => {
  const { user } = req;
  return res.json(Stock.findByCompany(user.user_com));
};
