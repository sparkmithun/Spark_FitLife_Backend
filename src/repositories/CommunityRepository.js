const BaseRepository = require('./BaseRepository');
const Community = require('../models/Community');

class CommunityRepository extends BaseRepository {
  constructor() {
    super(Community);
  }

  async findWithMembers(id) {
    return await this.model
      .findById(id)
      .populate('owner', 'name avatar')
      .populate('members', 'name avatar')
      .populate('moderators', 'name avatar');
  }

  async search(query) {
    return await this.model
      .find({ $text: { $search: query } })
      .populate('owner', 'name avatar')
      .limit(20);
  }

  async joinCommunity(communityId, userId) {
    return await this.model.findByIdAndUpdate(
      communityId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  }

  async leaveCommunity(communityId, userId) {
    return await this.model.findByIdAndUpdate(
      communityId,
      { $pull: { members: userId } },
      { new: true }
    );
  }

  async getByCategory(category) {
    return await this.model
      .find({ category })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });
  }
}

module.exports = new CommunityRepository();
