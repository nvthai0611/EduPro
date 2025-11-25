import { Request, Response } from "express";
import User from "../../../modules/user/user.model";
import { successResponse, errorResponse } from "../../../utils/response";
import { linkResetPassword } from "../../../services/userService/auth.service";

// [POST] /api/v1/auth/forgot-password-email
export const sendLinkResetPassword = async (req: Request, res: Response) => {
  res.json("Hello sendLinkResetPassword");
}

// [GET] /api/v1/auth/forgot-password-email
export const confirmEmailResetPassword = async (req: Request, res: Response) => {
  res.json("Hello confirmEmailResetPassword");
}