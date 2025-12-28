import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string; // For single-company users
  companyIds?: string[]; // For multi-company users (gestorías)
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
