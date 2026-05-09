const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/UserRepository');
const Otp = require('../models/Otp');
const emailService = require('./EmailService');

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  /**
   * Step 1: Register sends OTP to user's email (does NOT create the user yet)
   */
  async register({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Remove any previous OTP for this email
    await Otp.deleteMany({ email });

    const otp = emailService.generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.create({
      email,
      otp,
      userData: { name, password },
      expiresAt,
    });

    await emailService.sendOTP(email, otp, name);

    return { message: 'OTP sent to your email', email };
  }

  /**
   * Step 2: Verify OTP and create the user account
   */
  async verifyOTP({ email, otp }) {
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new AppError('No OTP found. Please register again.', 400);
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      throw new AppError('OTP has expired. Please register again.', 400);
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await Otp.deleteMany({ email });
      throw new AppError('Too many failed attempts. Please register again.', 429);
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new AppError('Invalid OTP. Please try again.', 400);
    }

    // OTP valid → create user
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      await Otp.deleteMany({ email });
      throw new AppError('Email already registered', 409);
    }

    const user = await userRepository.create({
      name: otpRecord.userData.name,
      email,
      password: otpRecord.userData.password,
    });

    await Otp.deleteMany({ email });

    const token = this.generateToken(user._id);
    user.password = undefined;
    return { user, token };
  }

  /**
   * Resend OTP for a pending registration
   */
  async resendOTP({ email }) {
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new AppError('No pending registration found. Please register again.', 400);
    }

    const otp = emailService.generateOTP();
    otpRecord.otp = otp;
    otpRecord.attempts = 0;
    otpRecord.expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await otpRecord.save();

    await emailService.sendOTP(email, otp, otpRecord.userData.name);

    return { message: 'OTP resent to your email', email };
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
