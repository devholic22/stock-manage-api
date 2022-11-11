import passwordCompare from "../functions/passwordCompare.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const postJoinAdmin = async (req, res) => {
  const { comName, name, id, password } = req.body;

  const companyExist = Company.findByName(comName);

  if (companyExist) {
    return res.json({
      error: "이미 등록된 회사 이름입니다."
    });
  }

  const userExsit = User.findById(id);

  if (userExsit) {
    return res.json({
      error: "이미 아이디가 등록되어 있습니다."
    });
  }

  const company = await Company.create(comName);
  const user = await User.create(company.comCode, name, id, password);

  return res.json({
    comCode: user.comCode,
    number: user.number,
    id: user.id
  });
};

export const postJoinUser = async (req, res) => {
  const { comCode, name, id, password } = req.body;

  const companyExist = Company.findByCode(comCode);

  if (!companyExist) {
    return res.json({
      error: "등록되지 않은 회사입니다."
    });
  }

  const userExist = User.findById(id);

  if (userExist) {
    return res.json({
      error: "이미 아이디가 등록되어 있습니다."
    });
  }

  const user = await User.create(comCode, name, id, password);

  return res.json({
    comCode: user.comCode,
    number: user.number,
    id: user.id
  });
};

export const postLogin = async (req, res) => {
  const { comCode, id, password } = req.body;

  const company = Company.findByCode(comCode);

  if (!company) {
    return res.json({
      error: "등록되지 않은 회사입니다."
    });
  }

  const user = User.findById(id);

  if (!user || user.comCode !== company.comCode) {
    return res.json({
      error: "해당 아이디의 유저가 없거나 유저의 회사 코드가 일치하지 않습니다."
    });
  }

  const correctPassword = passwordCompare(password, user.password);
  if (!correctPassword) {
    return res.json({
      error: "비밀번호가 일치하지 않습니다."
    });
  }

  const token = jwt.sign(
    {
      number: user.number
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "300m",
      issuer: "nodebird"
    }
  );

  return res.json({
    code: 200,
    message: "토큰 발급 완료",
    token
  });
};
