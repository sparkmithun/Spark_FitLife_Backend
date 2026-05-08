const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email }).select('+password');
  }

  async findByIdWithProfile(id) {
    return await this.model
      .findById(id)
      .populate('communities', 'name category')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');
  }

  async addFollower(userId, followerId) {
    await this.model.findByIdAndUpdate(userId, { $addToSet: { followers: followerId } });
    await this.model.findByIdAndUpdate(followerId, { $addToSet: { following: userId } });
  }

  async removeFollower(userId, followerId) {
    await this.model.findByIdAndUpdate(userId, { $pull: { followers: followerId } });
    await this.model.findByIdAndUpdate(followerId, { $pull: { following: userId } });
  }
}

module.exports = new UserRepository();
