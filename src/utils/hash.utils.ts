import bcrypt from "bcrypt";
import { BCRYPT } from "constants/default";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
