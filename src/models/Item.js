import { db } from "../models/index.js";

class Item {
  constructor(type, origin, name, size, unit, price, company) {
    this.number = db.data?.item.length + 1;
    this.type = type; // 분류
    this.origin = origin; // 제조사
    this.name = name; // 품명
    this.size = size; // 규격
    this.unit = unit; // 단위
    this.price = price; // 단가
    this.company = company; // 소유하고 있는 회사
  }

  static async create(type, origin, name, size, unit, price, company) {
    const item = new Item(type, origin, name, size, unit, price, company);

    await db.data?.items.push(item);

    await db.write();

    return item;
  }

  // 특정 회사가 가지고 있는 모든 품목 조회
  static findByCompany(company) {
    const items = db.data?.items;
    let result = [];
    for (const item of items) {
      if (item.company === company) {
        result.push(item);
      }
    }
    return result;
  }
}

export default Item;
