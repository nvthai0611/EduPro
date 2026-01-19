import UserService from "../../modules/user/user.service";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../../utils/jwt";
import { isTokenBlacklisted } from "../../modules/blacklist/blacklist.service";

const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = req.cookies?.render_id;

    if (!accessToken && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7).trim();
      } else {
        accessToken = authHeader.trim();
      }
    }

    if (!accessToken) {
      return next();
    }

    const blacklisted = await isTokenBlacklisted(accessToken);
    if (blacklisted) {
      return next();
    }

    const decode = await decodeToken(accessToken);
    if (!decode) {
      return next();
    }

    const user = await UserService.getUserById(decode.userId);
    if (!user || !user.isActive || !user.confirmEmail) {
      return next();
    }

    req.user = {
      id: user["_id"],
      userId: decode.userId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      image: user.image,
    };

    next();
  } catch (error) {
    // If anything fails, just move to next without req.user
    next();
  }
};

export default optionalAuthenticate;
