import { db } from "../models/index.js";

class Stock {
  constructor(type, origin, name, size, unit, price, company) {
    this.number = db.data?.stocks.length + 1;
    this.type = type; // 분류
    this.origin = origin; // 제조사
    this.name = name; // 품명
    this.size = size; // 규격
    this.unit = unit; // 단위
    this.price = price; // 단가
    this.company = company; // 소유하고 있는 회사
  }

  static async create(type, origin, name, size, unit, price, company) {
    const stock = new Stock(type, origin, name, size, unit, price, company);

    await db.data?.stocks.push(stock);

    await db.write();

    return stock;
  }

  // 특정 회사가 가지고 있는 모든 품목 조회
  static findByCompany(company) {
    const stocks = db.data?.stocks;
    let result = [];
    for (const stock of stocks) {
      if (stock.company === company) {
        result.push(stock);
      }
    }
    return result;
  }
}

export default Stock;
