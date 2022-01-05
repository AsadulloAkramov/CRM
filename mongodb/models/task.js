const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    reciverUserId: Number,
    deadline: Date,
    priority: {
      type: String,
      enum: ['High', 'Normal', 'Low']
    },
    task: String,
    userId: Number,
    status: {
      type: String,
      /*
      1 = Bajarilishi kerak
      2 = Bajarilmoqda
      3 = Bajarildi
      4 = Rad etildi
    */
      enum: ['1', '2', '3', '4'],
      default: '1'
    },
    givenBy: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('task', schema);
