import { Request, Response, NextFunction } from "express";

/**
 * Middleware to block direct browser access to API
 * Only allow requests from whitelisted origins (your frontend)
 */
const blockDirectAccess = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edu-pro-delta.vercel.app",
  ];

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Allow if request comes from allowed origin
  if (origin && allowedOrigins.includes(origin)) {
    return next();
  }

  // Allow if referer is from allowed domain
  if (referer) {
    const isAllowed = allowedOrigins.some(allowed => 
      referer.startsWith(allowed)
    );
    if (isAllowed) {
      return next();
    }
  }

  // Return 405 Method Not Allowed để Chrome hiển thị "This page isn't working"
  res.status(405).end();
};

export default blockDirectAccess;
