import { db } from "../models/index.js";
import Stock from "./Stock.js";

class History {
  constructor(count, memo, company, type, stockNum) {
    this.createdAt = History.dateFormat();
    this.count = count;
    this.memo = memo;
    this.company = company;
    this.type = type;
    this.stock = stockNum;
  }
  static async create(count, memo, company, type, stockNum) {
    const targetStock = Stock.findByNumber(company, type, stockNum);
    targetStock.count += count;
    targetStock.value += count * targetStock.price;
    await db.write();
    const history = new History(count, memo, company, type, stockNum);
    return history;
  }
  static findByDate(date, company, type, stockNum) {
    const day = History.dateFormat(date);
    const targetStock = Stock.findByNumber(company, type, stockNum);
    const logs = targetStock.history;
    for (const log of logs) {
      if (log.createdAt == day) {
        return log;
      }
    }
    return null;
  }
  static findByNumber(company, type, stock, number) {
    const targetStock = Stock.findByNumber(company, type, stock);
    const logs = targetStock.history;
    let low = 0;
    let high = logs.length - 1;

    if (number <= low || number > high + 1) {
      return null;
    }
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let guess = logs[mid];

      if (mid == number - 1) {
        return guess;
      } else if (mid < number - 1) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return null;
  }
  static async editHistory(company, type, stock, number, count, memo) {
    const targetStock = Stock.findByNumber(company, type, stock);
    const target = History.findByNumber(company, type, stock, number);

    if (target.count > count) {
      const minus = target.count - count;
      targetStock.count -= minus;
      targetStock.value -= minus * targetStock.price;
    } else if (target.count < count) {
      const plus = count - target.count;
      targetStock.count += plus;
      targetStock.value += plus * targetStock.price;
    }
    target.count = count;
    target.memo = memo;
    await db.write();
    return target;
  }
  static dateFormat() {
    const date = new Date();
    return (
      String(date.getFullYear()) +
      "/" +
      String(parseInt(date.getMonth()) + 1) +
      "/" +
      String(date.getDate())
    );
  }
}

export default History;
