const userService = require('../services/UserService');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user._id, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async followUser(req, res, next) {
    try {
      const result = await userService.followUser(req.user._id.toString(), req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async unfollowUser(req, res, next) {
    try {
      const result = await userService.unfollowUser(req.user._id.toString(), req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req, res, next) {
    try {
      const users = await userService.searchUsers(req.query.q || '');
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
