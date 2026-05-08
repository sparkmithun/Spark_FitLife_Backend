const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.verifyOtpRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 digits'),
];

exports.resendOtpRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

exports.postRules = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 2000 }),
  body('category')
    .optional()
    .isIn(['thought', 'progress', 'tip', 'motivation', 'question']),
];

exports.workoutRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type')
    .isIn(['run', 'walk', 'cycling', 'gym', 'yoga', 'swimming', 'hiit', 'other'])
    .withMessage('Valid workout type is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
];

exports.communityRules = [
  body('name').trim().notEmpty().withMessage('Community name is required').isLength({ max: 60 }),
  body('category')
    .optional()
    .isIn(['running', 'weightlifting', 'yoga', 'crossfit', 'cycling', 'general', 'nutrition', 'mental-health']),
];

exports.commentRules = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ max: 500 }),
];
