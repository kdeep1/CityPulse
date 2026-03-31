import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { refreshTokens } from "./auth.service";
import {prisma} from "../lib/prisma";

export const loginController = async (req: Request, res: Response, next: import("express").NextFunction) => {
  try {
    const { emailOrUsername, email, username, password } = req.body;
    const identifier = emailOrUsername || email || username;

    const { accessToken, refreshToken, user } = await loginUser(identifier, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "strict",
    });

    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req : Request, res: Response) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const { accessToken, refreshToken } = await refreshTokens(token);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.json({ accessToken });
};
export const updateProfileController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { email, username } = req.body;
  const userId = Number(req.user.id);

  await prisma.user.update({
    where: { id: userId },
    data: { email, username },
  });

  res.json({ message: "Profile updated successfully" });
}