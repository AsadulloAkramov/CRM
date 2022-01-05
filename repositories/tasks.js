const TaskModel = require('../mongodb/models/task');

const findById = async (id) => {
  const data = await TaskModel.findById(id);

  return data;
};

const setTask = async (args) => {
  const createOptions = {
    givenBy: args.givenBy,
    reciverUserId: args.reciverUserId,
    deadline: args.deadline,
    priority: args.priority,
    task: args.task,
    userId: args.userId
  };

  const createQuery = {};

  Object.keys(args).forEach((key) => {
    if (createOptions[key] !== undefined) {
      createQuery[key] = createOptions[key];
    }
  });

  const data = await TaskModel.create(createQuery);

  return data;
};

const getTasksByUserId = async (userId) => {
  const data = await TaskModel.find({
    userId
  }).lean();

  return data;
};

const setTaskStatus = async (taskId, status) => {
  const data = await TaskModel.findOneAndUpdate(
    { _id: taskId },
    {
      status
    },
    { new: true }
  );

  return data;
};

const getTaskStatusByStatusId = async (statusId) => {
  try {
    const data = await TaskModel.find({ status: statusId });

    return data;
  } catch (error) {
    throw new Error('Tasks Repository [getTaskStatusByStatusId]', error);
  }
};

const updateTask = async (args) => {
  const options = {
    task: { task: args.task },
    reciverUserId: { reciverUserId: args.reciverUserId },
    deadline: { deadline: args.deadline },
    priority: { priority: args.priority }
  };

  const keys = Object.keys(args);

  let updateQuery = {};

  for (let i = 1; i < keys.length; i += 1) {
    updateQuery = { ...updateQuery, ...options[keys[i]] };
  }

  const data = await TaskModel.findOneAndUpdate(
    {
      _id: args.taskId
    },
    updateQuery,
    { new: true }
  );

  return data;
};

const find = async (args) => {
  const queryOpts = {
    priority: args.priority,
    status: args?.status?.split('_')[1]
  };

  const query = {};

  Object.keys(args).forEach((key) => {
    if (key !== 'page' && key !== 'limit') {
      query[key] = queryOpts[key];
    }
  });

  const data = await TaskModel.find(query)
    .skip(args.page * args.limit - args.limit)
    .sort({ _id: -1 })
    .limit(args.limit)
    .lean();

  return data;
};

const findByOwnerId = async (args) => {
  const queryOpts = {
    priority: args.priority,
    status: args?.status?.split('_')[1],
    reciverUserId: args.reciverUserId
  };

  const query = {};

  Object.keys(args).forEach((key) => {
    if (key !== 'page' && key !== 'limit') {
      query[key] = queryOpts[key];
    }
  });

  const data = await TaskModel.find(query)
    .skip(args.page * args.limit - args.limit)
    .sort({ _id: -1 })
    .limit(args.limit)
    .lean();

  return data;
};

module.exports = {
  find,
  findById,
  setTask,
  getTasksByUserId,
  setTaskStatus,
  updateTask,
  findByOwnerId,
  getTaskStatusByStatusId
};
