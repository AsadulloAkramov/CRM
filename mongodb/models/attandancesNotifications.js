const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    reciverId: {
      type: Number
    },
    lessonId: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('attandances_notifications', schema);
