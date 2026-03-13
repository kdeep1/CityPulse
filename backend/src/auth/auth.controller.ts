import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { refreshTokens } from "./auth.service";

export const loginController = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.json({ accessToken });
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