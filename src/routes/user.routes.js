const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticate = require('../middleware/authenticate');

router.get('/search', authenticate, userController.searchUsers);
router.get('/:id', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/:id/follow', authenticate, userController.followUser);
router.post('/:id/unfollow', authenticate, userController.unfollowUser);

module.exports = router;
