import bcrypt from "bcrypt";

const passwordHash = async (password, salt) => {
  password = await bcrypt.hash(password, salt);
  return password;
};

export default passwordHash;
