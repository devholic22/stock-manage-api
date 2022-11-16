import Company from "../models/Company.js";
import Stock from "../models/Stock.js";
import StockType from "../models/StockType.js";

export const uploadStock = async (req, res) => {
  const { type, origin, name, size, unit, price } = req.body;

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
    const stock = await Stock.create(
      existType,
      origin,
      name,
      size,
      unit,
      price,
      company
    );
    result = await StockType.append(existType, stock);
  } else {
    const newType = await StockType.create(type, company);

    const stock = await Stock.create(
      newType,
      origin,
      name,
      size,
      unit,
      price,
      company
    );
    result = await StockType.append(newType, stock);
  }
  return res.json(result);
};

export const allStockOfUserCompany = (req, res) => {
  const { user } = req;
  return res.json(Company.findAll(user.user_com));
};
