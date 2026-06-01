import type { Request, Response } from "express";
import { User } from "../models/User";
import { HttpError } from "../utils/httpError";
import { signToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validators/authValidators";

function serializeUser(user: { _id: unknown; name: string; email: string }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email
  };
}

export async function register(req: Request, res: Response) {
  const payload = registerSchema.parse(req.body);
  const existing = await User.findOne({ email: payload.email });

  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const user = await User.create(payload);
  const safeUser = serializeUser(user);

  res.status(201).json({
    user: safeUser,
    token: signToken(safeUser)
  });
}

export async function login(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user || !(await user.comparePassword(payload.password))) {
    throw new HttpError(401, "Invalid email or password");
  }

  const safeUser = serializeUser(user);

  res.json({
    user: safeUser,
    token: signToken(safeUser)
  });
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
