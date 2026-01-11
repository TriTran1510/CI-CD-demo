import jwt from 'jsonwebtoken';

// Decode token and check if it's expired
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get remaining time in seconds
export const getTokenExpiryTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
  } catch (error) {
    return 0;
  }
};

// Verify and get token info
export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    const expiryTime = Math.floor((decoded.exp * 1000) - Date.now());
    return {
      valid: true,
      data: decoded,
      expiresIn: expiryTime,
      message: 'Token is valid',
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        data: jwt.decode(token),
        message: 'Token has expired',
        expiredAt: new Date(error.expiredAt),
      };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        valid: false,
        data: null,
        message: 'Invalid token',
      };
    }
    return {
      valid: false,
      data: null,
      message: error.message,
    };
  }
};
