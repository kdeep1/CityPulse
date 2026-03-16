import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15d"
  });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "30d"
  });
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};