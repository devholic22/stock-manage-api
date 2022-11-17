import { db } from "../models/index.js";
import Company from "./Company.js";

class StockType {
  constructor(name, company) {
    this.head = null;
    this.number = company.types.length + 1;
    this.name = name;
    this.company = company.number;
    this.size = 0;
  }
  static async create(name, company) {
    const type = new StockType(name, company);
    await Company.append(company.number, type);
    // db.data?.company[company.number - 1].types.push(type);
    await db.write();
    return type;
  }
  static async append(stockType, stock) {
    const type = StockType.findByNumber(stockType.company, stockType.number);
    const company = Company.findByNumber(stockType.company);

    if (!type.head) {
      type.head = stock;
    } else {
      let curr = type.head;
      while (curr.next) {
        curr = curr.next;
      }
      curr.next = stock;
    }

    company.stocks += 1;
    type.size += 1;

    await db.write();

    return stock;
  }

  static findByNumber(company_number, number) {
    const types = db.data?.company[company_number - 1].types;
    let low = 0;
    let high = types.length - 1;

    if (number <= low || number > high + 1) {
      return null;
    }

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let guess = types[mid];
      if (mid === number - 1) {
        return guess;
      } else if (mid < number - 1) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return null;
  }

  static traverse(company_number, number) {
    const target = StockType.findByNumber(company_number, number);
    const result = [];
    let curr = target.head;
    while (curr) {
      result.push(curr.name);
      curr = curr.next;
    }
    return result;
  }

  static traverseValue(company_number, number) {
    const target = StockType.findByNumber(company_number, number);
    const result = [];
    let curr = target.head;
    while (curr) {
      result.push({
        number: curr.number,
        origin: curr.origin,
        name: curr.name,
        size: curr.size,
        unit: curr.unit,
        count: curr.count,
        price: curr.price
      });
      curr = curr.next;
    }
    return result;
  }
}

export default StockType;
