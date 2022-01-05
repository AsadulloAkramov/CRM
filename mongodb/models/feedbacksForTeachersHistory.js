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
    enum: ['New', 'In Progress', 'Completed', 'Rejected']
  },
  newStatus: {
    type: String,
    enum: ['New', 'In Progress', 'Completed', 'Rejected']
  },
  feedbackId: {
    type: Number
  }
});

module.exports = mongoose.model('feedbacks_for_teachers_status_history', schema);
