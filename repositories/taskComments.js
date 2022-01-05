const TaskComment = require('../mongodb/models/taskComment');

const findByTaskId = async (taskId) => {
  const data = await TaskComment.find({ taskId }).sort({ _id: -1 });

  return data;
};

const getTaskCommentById = async (id) => {
  const data = await TaskComment.find({ _id: id });

  return data[0];
};

const createComment = async (args) => {
  const { taskId, comment, writtenBy } = args;

  const data = await TaskComment.create({
    taskId,
    comment,
    writtenBy
  });

  return data;
};

const findCountByTaskId = async (taskId) => {
  const data = await TaskComment.find({ taskId }).count();

  return data;
};

module.exports = {
  findByTaskId,
  createComment,
  findCountByTaskId,
  getTaskCommentById
};
