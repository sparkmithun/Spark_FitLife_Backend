const postService = require('../services/PostService');

class PostController {
  async create(req, res, next) {
    try {
      const post = await postService.createPost(req.user._id, req.body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  async getFeed(req, res, next) {
    try {
      const { page, limit, community } = req.query;
      const result = await postService.getFeed({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        community: community || null,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const posts = await postService.getUserPosts(
        req.params.userId,
        parseInt(req.query.page) || 1
      );
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const post = await postService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const post = await postService.toggleLike(req.params.id, req.user._id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const post = await postService.addComment(req.params.id, req.user._id, req.body.text);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await postService.deletePost(req.params.id, req.user._id.toString());
      res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
