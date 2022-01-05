const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);

const schema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date()
  },
  branchId: {
    type: Number
  },
  courseId: {
    type: Number
  },
  reciverUserId: {
    type: Number
  },
  payerUserId: {
    type: Number
  },
  amount: {
    type: Float
  },
  type: {
    type: String,
    enum: ['cash', 'teminal', 'online', 'bank']
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model('payment', schema);
