const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  date: {
    type: Date
  },
  userId: {
    type: Number
  },
  via: {
    type: String
  },
  message: {
    type: String
  },
  sended: {
    type: Number
  }
});

module.exports = mongoose.model('messages_history', schema);
