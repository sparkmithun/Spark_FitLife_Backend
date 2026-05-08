const communityService = require('../services/CommunityService');

class CommunityController {
  async create(req, res, next) {
    try {
      const community = await communityService.createCommunity(req.user._id, req.body);
      res.status(201).json(community);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page, limit, category } = req.query;
      const result = await communityService.getCommunities({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        category: category || undefined,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const community = await communityService.getCommunityById(req.params.id);
      res.status(200).json(community);
    } catch (error) {
      next(error);
    }
  }

  async join(req, res, next) {
    try {
      const community = await communityService.joinCommunity(req.params.id, req.user._id);
      res.status(200).json(community);
    } catch (error) {
      next(error);
    }
  }

  async leave(req, res, next) {
    try {
      const community = await communityService.leaveCommunity(req.params.id, req.user._id);
      res.status(200).json(community);
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const communities = await communityService.searchCommunities(req.query.q || '');
      res.status(200).json(communities);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const community = await communityService.updateCommunity(
        req.params.id,
        req.user._id.toString(),
        req.body
      );
      res.status(200).json(community);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommunityController();
