import { db } from "../models/index.js";

class Company {
  constructor(comName) {
    this.number = db.data?.company.length + 1;
    this.comName = comName;
    this.comCode = new Date().getTime().toString(36);
  }

  static async create(comName) {
    const company = new Company(comName);

    db.data?.company.push(company);

    await db.write();

    return company;
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
}

export default Company;
