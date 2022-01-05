const TasksHistoryModel = require('../mongodb/models/tasksHistory');

class TasksHistoryRepository {
  static async getTaskCommentsByTaskId(taskId) {
    try {
      return await TasksHistoryModel.find({
        taskId,
        activityType: 'commented_task'
      });
    } catch (error) {
      throw new Error('TasksHistoryRepository [getTaskCommentsByTaskId] error: ', error);
    }
  }

  static async getTaskHistoryByTaskId(taskId) {
    try {
      return await TasksHistoryModel.find({ taskId });
    } catch (error) {
      throw new Error('TasksHistoryRepository [getTaskHistoryByTaskId] error: ', error);
    }
  }

  static async createdTask(taskId, activityType, createdBy) {
    try {
      const newTask = new TasksHistoryModel({
        taskId,
        activityType,
        createdBy
      });
      await newTask.save();

      return newTask;
    } catch (error) {
      throw new Error('TasksHistoryRepository [createdTask] error: ', error);
    }
  }

  static async modifiedTaskStatus(taskId, activityType, modifierUserId, oldState, newState) {
    try {
      const task = new TasksHistoryModel({
        taskId,
        activityType,
        modifiedTaskStatus: { modifierUserId, oldState, newState }
      });
      await task.save();

      return task;
    } catch (error) {
      throw new Error('TasksHistoryRepository [modifiedTaskStatus] error: ', error);
    }
  }

  static async commentedTask(taskId, activityType, modifierUserId, taskCommentId) {
    try {
      const comments = await this.getTaskCommentsByTaskId(taskId);

      if (comments.length > 0) {
        comments[0].comments.push({ modifierUserId, taskCommentId });

        await comments[0].save();
      } else {
        const task = new TasksHistoryModel({
          taskId,
          activityType,
          comments: { modifierUserId, taskCommentId }
        });
        await task.save();

        return task;
      }
      return comments;
    } catch (error) {
      throw new Error('TasksHistoryRepository [commentedTask] error: ', error);
    }
  }

  static async attachedTask(taskId, activityType, attachedBy, responsibleUserId) {
    try {
      const task = new TasksHistoryModel({
        taskId,
        activityType,
        attachedTask: { attachedBy, responsibleUserId }
      });
      await task.save();

      return task;
    } catch (error) {
      throw new Error('TasksHistoryRepository [attachedTask] error: ', error);
    }
  }
}

module.exports = TasksHistoryRepository;
