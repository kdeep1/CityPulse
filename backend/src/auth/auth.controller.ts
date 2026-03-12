import { Request, Response } from "express";
import { loginUser } from "./auth.service";

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