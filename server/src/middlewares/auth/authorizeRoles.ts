import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/response";

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, {}, 401, "Chưa xác thực người dùng");
    }

    const userRole = (req.user as any).role;

    if (!roles.includes(userRole)) {
      return errorResponse(
        res,
        {},
        403,
        "Bạn không có quyền truy cập vào tài nguyên này"
      );
    }

    next();
  };
};
