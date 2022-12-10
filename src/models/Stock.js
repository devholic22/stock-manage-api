import { db } from "../models/index.js";
import StockType from "./StockType.js";
import History from "./History.js";

class Stock {
  constructor(type, origin, name, size, unit, price, dep, company) {
    this.number = db.data?.company[type.company - 1].stocks + 1;
    this.numberInType =
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
    this.history = []; // 입고 별 기록
    this.graph = []; // 그래프
    this.edit = null; // 편집 중인 상태 (특정 사람의 id가 들어가 있는지)인지, 일반 상태 (null)인지,
    this.createdAt = new Date();
    this.costUpdatedAt = new Date();
  }

  static create(type, origin, name, size, unit, price, dep, company) {
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
    console.log(type_number, number);
    const targetType = StockType.findByNumber(com_number, type_number);
    let curr = targetType.head;
    let result = {};
    let i = 0;
    while (i < number - 1) {
      if (curr.next === undefined) {
        curr = null;
        break;
      }
      curr = curr.next;
      i++;
    }
    if (!curr) {
      return null;
    }
    result = curr;
    // delete result["next"];
    // delete result["company"];
    return result;
  }

  static async update(stock, type, data) {
    const target = Stock.findByNumber(stock.company, type, stock.number);

    target.origin = data.origin;
    target.name = data.name;
    target.size = data.size;
    target.unit = data.unit;
    target.price = data.price;
    target.count = data.count;
    target.dep = data.dep;
    target.edit = null;
    await db.write();

    return target;
  }

  static async addHistory(day, count, memo, company, type, number) {
    const stock = Stock.findByNumber(company, type, number);
    const history = await History.create(
      day,
      Number(count),
      memo,
      company,
      type,
      number
    );
    const temp = {};
    temp[day] = count;
    stock.history.push(history);
    stock.graph.push(temp);
    await db.write();
    return history;
  }

  static async editState(stock, type, number) {
    const target = Stock.findByNumber(stock.company, type, stock.number);
    target.edit = number;
    await db.write();
    return target;
  }

  static async updateCost(stock, com, year) {
    const target = Stock.findByNumber(com, stock.type, stock.number);
    target.price *= ((100 - target.dep) / 100) ** year;
    target.value = target.count * target.price;
    target.costUpdatedAt = new Date();
    await db.write();
    return target;
  }
}

export default Stock;
