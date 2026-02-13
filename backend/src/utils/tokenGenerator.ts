import jwt from 'jsonwebtoken';

interface TokenPayload {
  adminId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'default_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'default_secret_change_me';
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const generateDeviceApiKey = (): string => {
  return `dk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export const generateEnrollmentToken = (): string => {
  return `et_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};
