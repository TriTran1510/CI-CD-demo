import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

class AuthService {
  async register(email, username, password) {
    const db = getDB();
    const usersCollection = db.collection('users');

    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      throw new AppError('Email already exists', 400);
    }

    const existingUsername = await usersCollection.findOne({ username });
    if (existingUsername) {
      throw new AppError('Username already exists', 400);
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const result = await usersCollection.insertOne({
      email,
      username,
      password: hashedPassword,
      salt: salt,
      createdAt: new Date(),
    });

    return {
      id: result.insertedId,
      email,
      username,
    };
  }

  async login(emailOrUsername, password) {
    const db = getDB();
    const usersCollection = db.collection('users');
    const sessionsCollection = db.collection('sessions');

    const user = await usersCollection.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      throw new AppError('Invalid email/username or password', 401);
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email/username or password', 401);
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Create session record
    const sessionResult = await sessionsCollection.insertOne({
      userId: user._id,
      email: user.email,
      username: user.username,
      accessToken,
      refreshToken,
      loginAt: new Date(),
      logoutAt: null,
      isActive: true,
    });

    return {
      id: user._id,
      email: user.email,
      username: user.username,
      accessToken,
      refreshToken,
      expiresIn: 3600,
      sessionId: sessionResult.insertedId,
    };
  }

  async logout(sessionId) {
    const db = getDB();
    const sessionsCollection = db.collection('sessions');

    const result = await sessionsCollection.updateOne(
      { _id: sessionId },
      {
        $set: {
          logoutAt: new Date(),
          isActive: false,
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new AppError('Session not found', 404);
    }

    return { message: 'Logout successful' };
  }

  async refreshToken(refreshToken) {
    const db = getDB();
    const sessionsCollection = db.collection('sessions');

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Find session with this refresh token
      const session = await sessionsCollection.findOne({
        refreshToken,
        isActive: true,
      });

      if (!session) {
        throw new AppError('Invalid refresh token or session expired', 401);
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Update session with new access token
      await sessionsCollection.updateOne(
        { _id: session._id },
        {
          $set: {
            accessToken: newAccessToken,
          },
        }
      );

      return {
        accessToken: newAccessToken,
        expiresIn: 3600,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token has expired. Please login again', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 401);
      }
      throw error;
    }
  }
}

export default new AuthService();