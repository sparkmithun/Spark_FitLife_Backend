const postRepository = require('../repositories/PostRepository');
const { AppError } = require('./AuthService');

class PostService {
  async createPost(authorId, postData) {
    return await postRepository.create({ ...postData, author: authorId });
  }

  async getFeed(options = {}) {
    const { page = 1, limit = 20, community = null } = options;
    const skip = (page - 1) * limit;
    const filter = community ? { community } : {};
    const posts = await postRepository.getFeed(filter, { skip, limit });
    const total = await postRepository.count(filter);
    return { posts, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getUserPosts(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await postRepository.getFeed({ author: userId }, { skip, limit });
  }

  async getPostById(postId) {
    const post = await postRepository.findById(postId, 'author comments.user community');
    if (!post) throw new AppError('Post not found', 404);
    return post;
  }

  async toggleLike(postId, userId) {
    const post = await postRepository.toggleLike(postId, userId);
    if (!post) throw new AppError('Post not found', 404);
    return post;
  }

  async addComment(postId, userId, text) {
    const post = await postRepository.addComment(postId, userId, text);
    if (!post) throw new AppError('Post not found', 404);
    return post;
  }

  async deletePost(postId, userId) {
    const post = await postRepository.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.author.toString() !== userId) {
      throw new AppError('Not authorized to delete this post', 403);
    }
    return await postRepository.deleteById(postId);
  }
}

module.exports = new PostService();
