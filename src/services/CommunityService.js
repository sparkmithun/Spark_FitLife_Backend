const communityRepository = require('../repositories/CommunityRepository');
const userRepository = require('../repositories/UserRepository');
const { AppError } = require('./AuthService');

class CommunityService {
  async createCommunity(ownerId, data) {
    const community = await communityRepository.create({
      ...data,
      owner: ownerId,
      members: [ownerId],
    });
    await userRepository.updateById(ownerId, {
      $addToSet: { communities: community._id },
    });
    return community;
  }

  async getCommunities(options = {}) {
    const { page = 1, limit = 20, category } = options;
    const skip = (page - 1) * limit;
    const filter = category ? { category } : {};
    const communities = await communityRepository.find(filter, {
      skip,
      limit,
      populate: 'owner',
    });
    const total = await communityRepository.count(filter);
    return { communities, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getCommunityById(id) {
    const community = await communityRepository.findWithMembers(id);
    if (!community) throw new AppError('Community not found', 404);
    return community;
  }

  async joinCommunity(communityId, userId) {
    const community = await communityRepository.joinCommunity(communityId, userId);
    if (!community) throw new AppError('Community not found', 404);
    await userRepository.updateById(userId, {
      $addToSet: { communities: communityId },
    });
    return community;
  }

  async leaveCommunity(communityId, userId) {
    const community = await communityRepository.leaveCommunity(communityId, userId);
    if (!community) throw new AppError('Community not found', 404);
    await userRepository.updateById(userId, {
      $pull: { communities: communityId },
    });
    return community;
  }

  async searchCommunities(query) {
    return await communityRepository.search(query);
  }

  async updateCommunity(communityId, userId, updateData) {
    const community = await communityRepository.findById(communityId);
    if (!community) throw new AppError('Community not found', 404);
    if (community.owner.toString() !== userId) {
      throw new AppError('Only the owner can update this community', 403);
    }
    return await communityRepository.updateById(communityId, updateData);
  }
}

module.exports = new CommunityService();
