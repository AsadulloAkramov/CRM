const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  date: {
    type: Date
  },
  userId: {
    type: Number
  },
  status: {
    type: String,
    enum: ['studying', 'completed_group', 'transferred_to_other_group']
  },
  groupId: {
    type: Number
  }
});

module.exports = mongoose.model('users_groups_history', schema);
