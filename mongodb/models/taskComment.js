const { Schema, model, Types } = require('mongoose');

const schema = new Schema(
  {
    writtenBy: Number,
    comment: String,
    taskId: {
      type: Types.ObjectId
    }
  },
  { timestamps: true }
);

module.exports = model('Task_comment', schema);
