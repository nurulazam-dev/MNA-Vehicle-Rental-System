import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authService } from "./auth.service";
import config from "../../config";

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req);

    const token = jwt.sign(result.rows[0], config.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      data: {
        token,
        user: result.rows[0],
      },
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req);

    res.status(201).send({
      success: true,
      message: "Signup successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

export const authController = {
  login,
  signup,
};
