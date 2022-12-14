import Company from "../models/Company.js";
import Notice from "../models/Notice.js";
import Stock from "../models/Stock.js";
import StockType from "../models/StockType.js";
import History from "../models/History.js";
import User from "../models/User.js";

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

export const allStockOfUserCompany = async (req, res) => {
  const { user } = req;
  const type = req.query.type;
  const stock = req.query.stock;
  const notices = Notice.traverse(user.user_com);
  if (notices.length > 5) {
    await Company.shiftNotice(user.user_com);
  }
  const player = User.findByNumber(user.user_number);
  const comName = Company.findByNumber(user.user_com).comName;

  const allData = Company.findAll(user.user_com);
  const now = new Date().getTime();
  for await (const data of allData) {
    let diffYear =
      (now - new Date(data.costUpdatedAt).getTime()) /
      (1000 * 60 * 60 * 24 * 30 * 12);
    if (diffYear >= 1) {
      console.log("가격 재조정");
      await Stock.updateCost(data, user.user_com, Math.floor(diffYear));
    }
  }

  if (!Boolean(type) || !Boolean(stock)) {
    const result = Company.findAll(user.user_com);
    return res.json({
      result,
      notices,
      name: player.name,
      role: player.role,
      com: comName
    });
  }
  const result = Stock.findByNumber(user.user_com, type, stock);
  if (!result) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  return res.json({
    result,
    notices,
    name: player.name,
    role: player.role,
    com: comName
  });
};

// 수정 페이지
export const getEditPage = async (req, res) => {
  const { user } = req;
  const type = req.query.type;
  const stock = req.query;
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
  if (result.edit !== null && result.edit != user.user_number) {
    return res.json({
      error: "다른 사람이 아직 편집 중 입니다."
    });
  }
  await Stock.editState(result, type, user.user_number);
  return res.send("편집 시작");
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
  if (result.edit !== null && result.edit != user.user_number) {
    return res.json({
      error: "다른 사람이 아직 편집 중 입니다."
    });
  }
  const answer = await Stock.update(result, type, req.body);
  return res.json(answer);
};

export const addStock = async (req, res) => {
  const { user } = req;
  const { user_com } = user;
  const { count, memo, day } = req.body;
  const { type, stock } = req.query;
  if (!Boolean(type) || !Boolean(stock)) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  const target = Stock.findByNumber(user_com, type, stock);
  if (!target) {
    return res.json({
      error: "분류 넘버 또는 품목 번호가 올바르지 않습니다."
    });
  }
  // 다른 날짜에만 기록을 업로드할 수 있도록 설정
  const existHistory = History.findByDate(day, user_com, type, stock);
  if (!existHistory) {
    const history = await Stock.addHistory(
      day,
      count,
      memo,
      user_com,
      type,
      stock
    );
    return res.json(history);
  }
};

export const editHistory = async (req, res) => {
  const { user } = req;
  const { user_com } = user;
  const { count, memo } = req.body;
  const { type, stock, number } = req.query;
  if (!Boolean(type) || !Boolean(stock) || !Boolean(number)) {
    return res.json({
      error: "분류 넘버, 품목 번호 또는 기록 넘버가 올바르지 않습니다."
    });
  }
  const existHistory = History.findByNumber(user_com, type, stock, number);
  if (existHistory) {
    const edited = await History.editHistory(
      user_com,
      type,
      stock,
      number,
      count,
      memo
    );
    return res.json(edited);
  } else {
    return res.json({ error: "해당 기록이 없습니다." });
  }
};
