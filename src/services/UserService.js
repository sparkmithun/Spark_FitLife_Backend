const userRepository = require('../repositories/UserRepository');
const { AppError } = require('./AuthService');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findByIdWithProfile(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowedFields = ['name', 'bio', 'avatar', 'fitnessGoals', 'avatarPublicId'];
    const filtered = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) filtered[key] = updateData[key];
    });
    const user = await userRepository.updateById(userId, filtered);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async followUser(currentUserId, targetUserId) {
    if (currentUserId === targetUserId) {
      throw new AppError('You cannot follow yourself', 400);
    }
    await userRepository.addFollower(targetUserId, currentUserId);
    return { message: 'User followed successfully' };
  }

  async unfollowUser(currentUserId, targetUserId) {
    await userRepository.removeFollower(targetUserId, currentUserId);
    return { message: 'User unfollowed successfully' };
  }

  async searchUsers(query) {
    return await userRepository.find(
      { name: { $regex: query, $options: 'i' } },
      { limit: 20, populate: '' }
    );
  }
}

module.exports = new UserService();
