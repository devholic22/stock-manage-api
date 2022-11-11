import { db } from "../models/index.js";
import passwordHash from "../functions/passwordHash.js";
class User {
  constructor(comCode, name, id, password) {
    this.number = db.data?.users.length + 1;
    this.comCode = comCode;
    this.name = name;
    this.id = id;
    this.password = password;
  }

  static async create(comCode, name, id, password) {
    const hashedPassword = await passwordHash(password, 5);
    const user = new User(comCode, name, id, hashedPassword);

    await db.data?.users.push(user);

    await db.write();

    return user;
  }

  static findByNumber(number) {
    const users = db.data?.users;
    let low = 0;
    let high = users.length - 1;

    if (number <= low || number > high + 1) {
      return null;
    }

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let guess = users[mid];

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

  static findById(id) {
    const users = db.data?.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        return users[i];
      }
    }
    return null;
  }
}

export default User;
