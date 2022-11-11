import bcrypt from "bcrypt";

const passwordCompare = (password1, password2) => {
  return bcrypt.compareSync(password1, password2);
};

export default passwordCompare;
