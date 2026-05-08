const { authService } = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const result = await authService.verifyOtp(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const result = await authService.resendOtp(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req, res) {
    res.status(200).json({ user: req.user });
  }
}

module.exports = new AuthController();
