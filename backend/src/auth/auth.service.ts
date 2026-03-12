import prisma from "../lib/prisma";
import { comparepassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const loginUser = async (email: string, password: string) => {

  const user = await prisma.user.findUnique({
    where: { email ,password},
  });

  if (!user) {
    throw new Error("Invalid credentials1");
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