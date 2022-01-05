const { Schema, model, Types } = require('mongoose');

const schema = new Schema(
  {
    taskId: {
      type: Types.ObjectId
    },
    activityType: {
      type: String,
      enum: ['created_task', 'attached_task', 'modified_task_status', 'commented_task']
    },
    createdBy: Number,
    attachedTask: {
      attachedBy: Number,
      responsibleUserId: Number
    },
    modifiedTaskStatus: {
      modifierUserId: Number,
      oldState: String,
      newState: String
    },
    comments: [
      {
        modifierUserId: Number,
        taskCommentId: Types.ObjectId
      }
    ]
  },
  { timestamps: true }
);

module.exports = model('Tasks_history', schema);
