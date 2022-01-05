const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  date: {
    type: Date
  },
  user: {
    id: Number,
    name: String
  },
  oldStatus: {
    type: String,
    enum: ['New', 'In progress', 'Completed', 'Rejected']
  },
  newStatus: {
    type: String,
    enum: ['New', 'In progress', 'Completed', 'Rejected']
  },
  requirementId: {
    type: Number
  }
});

module.exports = mongoose.model('requirements_statuses_history', schema);
