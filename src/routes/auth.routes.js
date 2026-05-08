const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { registerRules, loginRules } = require('../validators');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
