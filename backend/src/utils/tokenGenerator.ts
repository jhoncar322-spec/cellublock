import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  adminId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret || secret === 'default_secret_change_me') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
    console.warn('⚠️  WARNING: Using default JWT_SECRET. This is insecure!');
  }
  
  const secretKey = secret || 'default_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(payload, secretKey, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret || secret === 'default_secret_change_me') {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set in production environment');
      }
    }
    
    const secretKey = secret || 'default_secret_change_me';
    return jwt.verify(token, secretKey) as TokenPayload;
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
