const BaseRepository = require('./BaseRepository');
const Post = require('../models/Post');

class PostRepository extends BaseRepository {
  constructor() {
    super(Post);
  }

  async getFeed(filter = {}, options = {}) {
    const { sort = { createdAt: -1 }, limit = 20, skip = 0 } = options;
    return await this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .populate('community', 'name');
  }

  async toggleLike(postId, userId) {
    const post = await this.model.findById(postId);
    if (!post) return null;

    const index = post.likes.indexOf(userId);
    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(userId);
    }
    return await post.save();
  }

  async addComment(postId, userId, text) {
    return await this.model.findByIdAndUpdate(
      postId,
      { $push: { comments: { user: userId, text } } },
      { new: true }
    ).populate('comments.user', 'name avatar');
  }
}

module.exports = new PostRepository();
