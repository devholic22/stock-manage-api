import { db } from "../models/index.js";

class Stock {
  constructor(type, origin, name, size, unit, price, company) {
    this.number =
      db.data?.company[type.company - 1].types[type.number - 1].size + 1;
    this.origin = origin; // 제조사
    this.name = name; // 품명
    this.size = size; // 규격
    this.unit = unit; // 단위
    this.price = price; // 단가
    this.company = company.number; // 회사
    this.next = null;
  }

  static async create(type, origin, name, size, unit, price, company) {
    const stock = new Stock(type, origin, name, size, unit, price, company);
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
