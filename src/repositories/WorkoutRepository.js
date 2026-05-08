const BaseRepository = require('./BaseRepository');
const Workout = require('../models/Workout');

class WorkoutRepository extends BaseRepository {
  constructor() {
    super(Workout);
  }

  async getUserWorkouts(userId, options = {}) {
    const { sort = { date: -1 }, limit = 20, skip = 0, type } = options;
    const filter = { user: userId };
    if (type) filter.type = type;

    return await this.model.find(filter).sort(sort).skip(skip).limit(limit);
  }

  async getStats(userId) {
    return await this.model.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          totalDuration: { $sum: '$duration' },
          totalDistance: { $sum: '$distance' },
          totalCalories: { $sum: '$calories' },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getWeeklySummary(userId) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return await this.model.aggregate([
      { $match: { user: userId, date: { $gte: oneWeekAgo } } },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
          totalDistance: { $sum: '$distance' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}

module.exports = new WorkoutRepository();
