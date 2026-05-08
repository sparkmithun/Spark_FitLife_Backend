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

module.exports = router;
