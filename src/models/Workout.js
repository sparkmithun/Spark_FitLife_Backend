const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['run', 'walk', 'cycling', 'gym', 'yoga', 'swimming', 'hiit', 'other'],
      required: [true, 'Workout type is required'],
    },
    title: {
      type: String,
      required: [true, 'Workout title is required'],
      trim: true,
      maxlength: 100,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: 1,
    },
    distance: {
      type: Number, // in km
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: '',
    },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, default: 0 },
        reps: { type: Number, default: 0 },
        weight: { type: Number, default: 0 }, // in kg
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Workout', workoutSchema);
