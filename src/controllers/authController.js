import authService from '../services/authServices.js';
import { verifyToken } from '../utils/tokenUtils.js';

export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, username, and password are required',
      });
    }

    const user = await authService.register(email, username, password);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email/Username and password are required',
      });
    }

    const result = await authService.login(emailOrUsername, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await authService.logout();

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required',
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const checkToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'No token provided',
      });
    }

    const result = verifyToken(
      token,
      process.env.JWT_SECRET
    );

    res.status(200).json({
      status: 'success',
      isValid: result.valid,
      message: result.message,
      data: {
        userId: result.data?.id,
        email: result.data?.email,
        expiresAt: new Date(result.data?.exp * 1000),
        expiresIn: result.expiresIn,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};