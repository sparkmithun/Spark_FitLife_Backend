const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { postRules, commentRules } = require('../validators');

router.post('/', authenticate, postRules, validate, postController.create);
router.get('/feed', authenticate, postController.getFeed);
router.get('/user/:userId', authenticate, postController.getUserPosts);
router.get('/:id', authenticate, postController.getById);
router.post('/:id/like', authenticate, postController.toggleLike);
router.post('/:id/comment', authenticate, commentRules, validate, postController.addComment);
router.delete('/:id', authenticate, postController.remove);

module.exports = router;
