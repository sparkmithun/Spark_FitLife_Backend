const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  attempts: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index - auto-deletes when expired
  },
}, { timestamps: true });

// Compound index for fast lookup
otpSchema.index({ email: 1, otp: 1 });

module.exports = mongoose.model('Otp', otpSchema);
