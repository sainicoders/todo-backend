import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { verifyToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError(401, "Authentication token is required"));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired authentication token"));
  }
}
