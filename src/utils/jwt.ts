import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtUser = {
  id: string;
  email: string;
  name: string;
};

export function signToken(user: JwtUser) {
  return jwt.sign(user, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtUser;
}
