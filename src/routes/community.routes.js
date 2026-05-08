const express = require('express');
const router = express.Router();
const communityController = require('../controllers/CommunityController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { communityRules } = require('../validators');

router.post('/', authenticate, communityRules, validate, communityController.create);
router.get('/', communityController.getAll);
router.get('/search', communityController.search);
router.get('/:id', communityController.getById);
router.post('/:id/join', authenticate, communityController.join);
router.post('/:id/leave', authenticate, communityController.leave);
router.put('/:id', authenticate, communityController.update);

module.exports = router;
