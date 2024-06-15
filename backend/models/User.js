const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  lastUpdated: {
    type: String,
    default: null,
  }
});

module.exports = mongoose.model('User', UserSchema);
