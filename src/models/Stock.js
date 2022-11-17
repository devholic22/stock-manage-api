import { db } from "../models/index.js";
import StockType from "./StockType.js";

class Stock {
  constructor(type, origin, name, size, unit, price, dep, company) {
    this.number =
      db.data?.company[type.company - 1].types[type.number - 1].size + 1;
    this.origin = origin; // 제조사
    this.name = name; // 품명
    this.size = size; // 규격
    this.unit = unit; // 단위
    this.price = price; // 단가
    this.count = 0; // 수량 (기본값 0)
    this.dep = dep; // 감가 상각 비율 (백분율)
    this.value = this.price * this.count; // 재고 금액 (단가 x 수량)
    this.company = company.number; // 회사
    this.next = null;
    dep;
    this.history = []; // 입고 별 기록
  }

  static async create(type, origin, name, size, unit, price, dep, company) {
    const stock = new Stock(
      type,
      origin,
      name,
      size,
      unit,
      price,
      dep,
      company
    );
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

  static findByNumber(com_number, type_number, number) {
    const targetType = StockType.findByNumber(com_number, type_number);
    if (!targetType) {
      return null;
    }
    let curr = targetType.head;
    let result = {};
    let i = 0;
    while (i < number - 1) {
      curr = curr.next;
      i++;
    }
    if (!curr) {
      return null;
    }
    result = curr;
    delete result["next"];
    delete result["company"];
    return result;
  }
}

export default Stock;
