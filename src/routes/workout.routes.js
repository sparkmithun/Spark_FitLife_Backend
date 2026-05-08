const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/WorkoutController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { workoutRules } = require('../validators');

router.post('/', authenticate, workoutRules, validate, workoutController.create);
router.get('/', authenticate, workoutController.getUserWorkouts);
router.get('/stats', authenticate, workoutController.getStats);
router.get('/weekly', authenticate, workoutController.getWeeklySummary);
router.get('/:id', authenticate, workoutController.getById);
router.put('/:id', authenticate, workoutController.update);
router.delete('/:id', authenticate, workoutController.remove);

module.exports = router;
