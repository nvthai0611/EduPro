import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../../modules/user/user.service";

interface JwtPayload {
  userId: string;
  email?: string;
}

export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.render_id;
    if (!token) return next();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const infoUser = await userService.getUserById(decoded.userId);
    
    req.user = {
      id: decoded.userId,
      email: infoUser.email || "unknown",
    };
  } catch {
    req.user = undefined;
  }

  next();
};
