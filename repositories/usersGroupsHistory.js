const UsersGroupsHistory = require('../mongodb/models/usersGroupsHistory');
const pg = require('../utils/pg');

const statuses = {
  1: 'studying',
  2: 'transferred_to_other_group',
  3: 'completed_group'
};

const userJoinedTheGroup = async (userId, groupId) => {
  const history = new UsersGroupsHistory({
    date: new Date(),
    userId,
    groupId,
    status: statuses[1]
  });
  await history.save();
};

const getStudentJoinedGroups = async (userId) => {
  const userJoinedGroupsIds = [];

  const userJoinedGroups = (
    await UsersGroupsHistory.find({
      userId,
      status: Object.values(statuses)
    }).lean()
  ).map(({ groupId, status }) => {
    userJoinedGroupsIds.push(groupId);
    return {
      status
    };
  });

  const groups = await pg(false, 'select * from groups where id = any($1)', userJoinedGroupsIds);

  for (let i = 0; i < groups.length; i += 1) {
    groups[i].status = userJoinedGroups[i].status;
  }

  return groups;
};

const studentTransferredToOtherGroup = async (userId, oldGroupId, newGroupId) => {
  await UsersGroupsHistory.findOneAndUpdate(
    { $and: [{ userId }, { groupId: oldGroupId }] },
    {
      status: statuses[2],
      date: new Date()
    }
  );
  userJoinedTheGroup(userId, newGroupId);
};

const completedGroup = async (studentsUserIds, groupId) => {
  try {
    await UsersGroupsHistory.updateMany(
      {
        $and: [{ userId: studentsUserIds.map((i) => i.user_id) }, { groupId }]
      },
      {
        status: statuses['3'],
        date: new Date()
      }
    );
  } catch (error) {
    throw new Error('UserGroupHistory Repository [completedGroup], ', error);
  }
};

const getRoomById = async (roomId) => {
  const query = 'select * from rooms where id = $1 and is_active = true;';
  const data = await pg(true, query, roomId);
  return data;
};

const getTeacherById = async (teacherId) => {
  const query = "select * from teachers where id = $1 and status = 'teaching';";
  const data = await pg(true, query, teacherId);
  return data;
};

const getStudentsCount = async (groupId) => {
  const query = 'select count(id) from students where is_active = true and group_id = $1;';
  const data = await pg(true, query, groupId);
  return data;
};

const getStudentById = async (studentId) => {
  const query = 'select * from students where id = $1 and is_active = true';
  const data = await pg(true, query, studentId);
  return data;
};

const getStudentGroupsByUserId = async (userId) => {
  const data = await UsersGroupsHistory.find({
    userId
  }).lean();

  return data;
};

module.exports = {
  userJoinedTheGroup,
  getStudentJoinedGroups,
  studentTransferredToOtherGroup,
  completedGroup,
  getRoomById,
  getTeacherById,
  getStudentsCount,
  getStudentById,
  getStudentGroupsByUserId
};
