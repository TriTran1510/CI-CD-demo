import { AppError } from './errorHandler.js';
import { verifyToken } from '../utils/tokenUtils.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const result = verifyToken(
      token,
      process.env.JWT_SECRET
    );

    if (!result.valid) {
      throw new AppError(result.message, 401);
    }

    // Attach user data and token info to request
    req.user = result.data;
    req.tokenInfo = {
      expiresIn: result.expiresIn,
      expiresAt: new Date(result.data.exp * 1000),
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Optional: Middleware to warn when token is about to expire (e.g., within 5 minutes)
export const tokenExpiryWarningMiddleware = (req, res, next) => {
  if (req.tokenInfo && req.tokenInfo.expiresIn < 300) {
    // 300 seconds = 5 minutes
    res.setHeader('X-Token-Expiring-Soon', 'true');
    res.setHeader('X-Token-Expires-In', req.tokenInfo.expiresIn);
  }
  next();
};
