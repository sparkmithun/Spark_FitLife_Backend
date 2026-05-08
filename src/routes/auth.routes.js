const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { registerRules, loginRules, verifyOtpRules, resendOtpRules } = require('../validators');

router.post('/register', registerRules, validate, authController.register);
router.post('/verify-otp', verifyOtpRules, validate, authController.verifyOtp);
router.post('/resend-otp', resendOtpRules, validate, authController.resendOtp);
router.post('/login', loginRules, validate, authController.login);
router.get('/me', authenticate, authController.me);

// Temporary diagnostic: test SMTP connection on Render
router.get('/test-smtp', async (req, res) => {
  try {
    const emailService = require('../services/EmailService');
    const transporter = emailService.getTransporter();
    await transporter.verify();
    res.json({ status: 'SMTP connection OK', email: process.env.SMTP_EMAIL });
  } catch (err) {
    res.status(500).json({
      status: 'SMTP FAILED',
      code: err.code,
      message: err.message,
      responseCode: err.responseCode,
      command: err.command,
    });
  }
});

module.exports = router;
