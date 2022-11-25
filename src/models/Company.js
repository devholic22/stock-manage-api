import { db } from "../models/index.js";
import StockType from "./StockType.js";

class Company {
  constructor(comName) {
    this.types = [];
    this.comName = comName;
    this.comCode = new Date().getTime().toString(36);
    this.size = 0;
    this.number = db.data?.company.length + 1;
    this.stocks = 0;
  }

  static async create(comName) {
    const company = new Company(comName);

    db.data?.company.push(company);

    await db.write();

    return company;
  }

  static async append(number, type) {
    const company = Company.findByNumber(number);

    company.types.push(type);
    company.size += 1;
    await db.write();

    return type;
  }

  static async appendNotice(number, notice) {
    const company = Company.findByNumber(number);
    company.notice.push(notice);
    await db.write();
    return notice;
  }

  static async shiftNotice(number) {
    const company = Company.findByNumber(number);
    const result = company.notice.shift();
    await db.write();
    return result;
  }

  static findByNumber(number) {
    const companies = db.data?.company;
    let low = 0;
    let high = companies.length - 1;
    if (number <= low || number > high + 1) {
      return null;
    }

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let guess = companies[mid];
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

  static findByCode(code) {
    const companies = db.data?.company;
    for (let i = 0; i < companies.length; i++) {
      if (companies[i].comCode === code) {
        return companies[i];
      }
    }
    return null;
  }

  static findByName(name) {
    const companies = db.data?.company;
    for (let i = 0; i < companies.length; i++) {
      if (companies[i].comName === name) {
        return companies[i];
      }
    }
    return null;
  }

  static findAll(number) {
    const company = Company.findByNumber(number);
    const result = [];
    let temp = null;

    for (const type of company.types) {
      temp = StockType.traverseValue(company.number, type.number);
      for (const t of temp) {
        result.push(t);
      }
    }
    return result;
  }
}

export default Company;
