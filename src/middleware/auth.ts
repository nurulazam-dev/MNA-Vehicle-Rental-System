import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1] as string;

      if (!token) {
        res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Unauthorized",
        });
        return;
      }

      const decode = jwt.verify(
        token,
        config.JWT_SECRET as Secret
      ) as JwtPayload;

      req.user = decode;

      if (roles.length && !roles.includes(decode.role)) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Forbidden",
        });
        return;
      }

      next();
    } catch (err: any) {
      res.send(401).send({
        success: false,
        message: err.message,
        data: null,
      });
    }
  };
};

export default auth;
