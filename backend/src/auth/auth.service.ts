import prisma from "../lib/prisma";
import { comparepassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;


// LOGIN SERVICE
export const loginUser = async (email: string, password: string) => {

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparepassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};


// REFRESH TOKEN SERVICE
export const refreshTokens = async (token: string) => {

  const payload: any = jwt.verify(token, REFRESH_SECRET);

  console.log('====================================');
  console.log(payload, "PAYLOAD");
  console.log('====================================');
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token }
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // DELETE OLD TOKEN (rotation)
  await prisma.refreshToken.delete({
    where: { token }
  });

  const newPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(newPayload);
  const refreshToken = generateRefreshToken(newPayload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return { accessToken, refreshToken };
};