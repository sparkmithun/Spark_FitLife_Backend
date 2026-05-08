const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
   * Step 1: Validate input, hash password, send OTP email
   */
  async register({ name, email, password }) {
    // Check if email already has a verified account
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password before storing in OTP record
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = emailService.generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Remove any previous OTP for same email, then create new
    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      userData: { name, password: hashedPassword },
      expiresAt,
    });

    // Send OTP email in background (don't wait for SMTP round-trip)
    emailService.sendOTP(email, otp, name).catch((err) => {
      console.error('Failed to send OTP email:', err.message);
    });

    return {
      message: 'Verification code sent to your email',
      email,
    };
  }

  /**
   * Step 2: Verify OTP and complete registration
   */
  async verifyOtp({ email, otp }) {
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      throw new AppError('No verification request found. Please register again.', 400);
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      throw new AppError('Verification code expired. Please register again.', 410);
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await Otp.deleteMany({ email });
      throw new AppError('Too many failed attempts. Please register again.', 429);
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new AppError(
        `Invalid verification code. ${MAX_OTP_ATTEMPTS - otpRecord.attempts} attempts remaining.`,
        400
      );
    }

    // OTP correct — create the actual user with pre-hashed password
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      await Otp.deleteMany({ email });
      throw new AppError('Email already registered', 409);
    }

    // Create user directly (password already hashed, skip the pre-save hook)
    const User = require('../models/User');
    const user = new User({
      name: otpRecord.userData.name,
      email,
      password: otpRecord.userData.password,
    });
    // Save without triggering the bcrypt pre-save hook (password is already hashed)
    user.$__.$skipPasswordHash = true;
    await user.save();

    // Cleanup OTP records
    await Otp.deleteMany({ email });

    const token = this.generateToken(user._id);
    return { user, token };
  }

  /**
   * Resend a new OTP for pending registration
   */
  async resendOtp({ email }) {
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      throw new AppError('No pending registration found. Please register again.', 400);
    }

    // Generate fresh OTP
    const otp = emailService.generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    otpRecord.otp = otp;
    otpRecord.expiresAt = expiresAt;
    otpRecord.attempts = 0;
    await otpRecord.save();

    // Send in background
    emailService.sendOTP(email, otp, otpRecord.userData.name).catch((err) => {
      console.error('Failed to resend OTP email:', err.message);
    });

    return { message: 'New verification code sent to your email', email };
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
