import Company from "./Company.js";

class Notice {
  constructor(title, content, owner, com) {
    this.title = title;
    this.content = content;
    this.owner = owner;
    this.com = com;
    this.createdAt = new Date();
  }
  static async create(title, content, owner, com) {
    const notice = new Notice(title, content, owner, com);
    await Company.appendNotice(com, notice);
    return notice;
  }
  static async shift(com) {
    const result = await Company.shiftNotice(com);
    return result;
  }
  static traverse(com) {
    const company = Company.findByNumber(com);
    return company.notice;
  }
}

export default Notice;
