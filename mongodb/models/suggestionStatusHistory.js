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
  suggestionId: {
    type: Number
  }
});

module.exports = mongoose.model('suggestions_statuses_history', schema);
