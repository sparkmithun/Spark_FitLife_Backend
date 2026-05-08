const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/UserRepository');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  async register({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }
    const user = await userRepository.create({ name, email, password });
    const token = this.generateToken(user._id);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    const token = this.generateToken(user._id);
    user.password = undefined;
    return { user, token };
  }
}

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = { authService: new AuthService(), AppError };
