const workoutRepository = require('../repositories/WorkoutRepository');
const { AppError } = require('./AuthService');
const mongoose = require('mongoose');

class WorkoutService {
  async createWorkout(userId, workoutData) {
    return await workoutRepository.create({ ...workoutData, user: userId });
  }

  async getUserWorkouts(userId, options = {}) {
    const { page = 1, limit = 20, type } = options;
    const skip = (page - 1) * limit;
    return await workoutRepository.getUserWorkouts(userId, { skip, limit, type });
  }

  async getWorkoutById(workoutId, userId) {
    const workout = await workoutRepository.findById(workoutId);
    if (!workout) throw new AppError('Workout not found', 404);
    if (workout.user.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }
    return workout;
  }

  async updateWorkout(workoutId, userId, updateData) {
    const workout = await workoutRepository.findById(workoutId);
    if (!workout) throw new AppError('Workout not found', 404);
    if (workout.user.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }
    return await workoutRepository.updateById(workoutId, updateData);
  }

  async deleteWorkout(workoutId, userId) {
    const workout = await workoutRepository.findById(workoutId);
    if (!workout) throw new AppError('Workout not found', 404);
    if (workout.user.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }
    return await workoutRepository.deleteById(workoutId);
  }

  async getStats(userId) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await workoutRepository.getStats(objectId);
  }

  async getWeeklySummary(userId) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await workoutRepository.getWeeklySummary(objectId);
  }
}

module.exports = new WorkoutService();
