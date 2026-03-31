import {prisma} from "../lib/prisma";
import { comparepassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;


// LOGIN SERVICE
export const loginUser = async (emailOrUsername: string, password: string) => {
  const cleanIdentifier = emailOrUsername.trim();
  const cleanPassword = password.trim();

  console.log("LOGIN ATTEMPT - Identifier:", cleanIdentifier, "Length:", cleanIdentifier.length);
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: cleanIdentifier },
        { username: cleanIdentifier }
      ]
    },
  });

  if (!user) {
    console.log("LOGIN FAILED - User not found in DB");
    throw new Error("Invalid credentials");
  }

  console.log("LOGIN - User found:", user.username, "Hashed Pass Length:", user.password?.length);
  const isValid = await comparepassword(cleanPassword, user.password);
  console.log("LOGIN - Password match result:", isValid, "Input Pass Length:", cleanPassword.length);

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

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, username: user.username },
  };
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