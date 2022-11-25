import Company from "../models/Company.js";
import Notice from "../models/Notice.js";
import Stock from "../models/Stock.js";
import StockType from "../models/StockType.js";

export const uploadStock = async (req, res) => {
  const { type, origin, name, size, unit, price, dep } = req.body;

  const company = Company.findByNumber(req.user.user_com);
  let existType = null;
  let result = null;
  for (let i = 0; i < company.size; i++) {
    if (company.types[i].name === type) {
      existType = company.types[i];
      break;
    }
  }

  if (existType) {
    const stocks = StockType.traverse(existType.company, existType.number);

    for (const c of stocks) {
      if (c === name) {
        return res.json({
          error: "이미 등록되어 있는 품목입니다."
        });
      }
    }
    const stock = Stock.create(
      existType,
      origin,
      name,
      size,
      unit,
      price,
      dep,
      company
    );
    result = await StockType.append(existType, stock);
  } else {
    const newType = await StockType.create(type, company);

    const stock = Stock.create(
      newType,
      origin,
      name,
      size,
      unit,
      price,
      dep,
      company
    );
    result = await StockType.append(newType, stock);
  }
  return res.json(result);
};

export const allStockOfUserCompany = (req, res) => {
  const { user } = req;
  const type = req.query.type;
  const stock = req.query.stock;
  const notices = Notice.traverse(user.user_com);
  if (!Boolean(type) || !Boolean(stock)) {
    const result = Company.findAll(user.user_com);
    return res.json({ result, notices });
  }
  const result = Stock.findByNumber(user.user_com, type, stock);
  if (!result) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  return res.json({ result, notices });
};

export const editStock = async (req, res) => {
  const { user } = req;
  const type = req.query.type;
  const stock = req.query.stock;
  if (!Boolean(type) || !Boolean(stock)) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  const result = Stock.findByNumber(user.user_com, type, stock);
  if (!result) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  const answer = await Stock.update(result, type, req.body);
  return res.json(answer);
};
