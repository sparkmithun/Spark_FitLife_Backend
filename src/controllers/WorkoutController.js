const workoutService = require('../services/WorkoutService');

class WorkoutController {
  async create(req, res, next) {
    try {
      const workout = await workoutService.createWorkout(req.user._id, req.body);
      res.status(201).json(workout);
    } catch (error) {
      next(error);
    }
  }

  async getUserWorkouts(req, res, next) {
    try {
      const { page, limit, type } = req.query;
      const workouts = await workoutService.getUserWorkouts(req.user._id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        type: type || undefined,
      });
      res.status(200).json(workouts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const workout = await workoutService.getWorkoutById(req.params.id, req.user._id.toString());
      res.status(200).json(workout);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const workout = await workoutService.updateWorkout(
        req.params.id,
        req.user._id.toString(),
        req.body
      );
      res.status(200).json(workout);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await workoutService.deleteWorkout(req.params.id, req.user._id.toString());
      res.status(200).json({ message: 'Workout deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await workoutService.getStats(req.user._id.toString());
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getWeeklySummary(req, res, next) {
    try {
      const summary = await workoutService.getWeeklySummary(req.user._id.toString());
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkoutController();
