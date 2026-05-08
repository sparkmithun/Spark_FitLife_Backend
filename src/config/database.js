const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect(uri) {
    try {
      this.connection = await mongoose.connect(uri);
      console.log('✅  MongoDB connected successfully');
      return this.connection;
    } catch (error) {
      console.error('❌  MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
  }
}

module.exports = new Database();
