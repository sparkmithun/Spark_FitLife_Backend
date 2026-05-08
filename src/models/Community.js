const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Community name is required'],
      unique: true,
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    category: {
      type: String,
      enum: ['running', 'weightlifting', 'yoga', 'crossfit', 'cycling', 'general', 'nutrition', 'mental-health'],
      default: 'general',
    },
    cover: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

communitySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Community', communitySchema);
