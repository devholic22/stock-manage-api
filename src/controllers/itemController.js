import Item from "../models/Item.js";

export const uploadItem = async (req, res) => {
  const { type, origin, name, size, unit, price } = req.body;
  const itemsOfUserCompany = Item.findByCompany(req.user.user_com);

  for (const item of itemsOfUserCompany) {
    if (item.name === name) {
      return res.json({
        error: "이미 등록되어 있는 제품입니다."
      });
    }
  }

  const item = await Item.create(
    type,
    origin,
    name,
    size,
    unit,
    price,
    req.user.user_com
  );

  return res.json(item);
};

export const allItemOfUserCompany = (req, res) => {
  const { user } = req;
  return res.json(Item.findByCompany(user.user_com));
};
