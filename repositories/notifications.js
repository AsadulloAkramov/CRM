const pg = require('../utils/pg');
const { ROLES } = require('../config/index');

async function isSuperAdmin(userId) {
  try {
    return await pg(
      true,
      `
        select * from permissions where user_id = $1 and role_id = (
          select id from roles where name = '${ROLES.superAdmin}'
        );
      `,
      userId
    );
  } catch (error) {
    throw Error(`notifications repository [isSuperAdmin]:${error}`);
  }
}

async function isAdmin(userId, branchId) {
  try {
    return await pg(
      true,
      `
        select * from admins where is_active = true and user_id = $1 and branch_id = $2;
      `,
      userId,
      branchId
    );
  } catch (error) {
    throw Error(`notifications repository [name]:${error}`);
  }
}

async function getLessonById(lessonId) {
  try {
    return await pg(
      true,
      `
    select * from lessons where id = $1;
  `,
      lessonId
    );
  } catch (error) {
    throw Error(`notifications repository [getLessonById]:${error}`);
  }
}

async function getBranchIdByLessonId(payload) {
  try {
    return await pg(
      true,
      `
    select
      b.id
    from
      lessons as l
      join groups as g on l.group_id = g.id
      join rooms as r on g.room_id = r.id
      join branches as b on r.branch_id = b.id
    where
      l.id = $1;
  `,
      payload
    );
  } catch (error) {
    throw Error(`notifications repository [getBranchIdByLessonId]:${error}`);
  }
}

async function insertNotification(payload, userId) {
  try {
    return await pg(
      false,
      `
        insert into attendances_notifications(
          lesson_id,
          user_id
        ) values(
          $1, $2
        );
      `,
      payload,
      userId
    );
  } catch (error) {
    throw Error(`notifications repository [insertNotification]:${error}`);
  }
}

async function getUserById(userId) {
  try {
    return await pg(
      true,
      `
    select * from users where id = $1 and is_active = true;
  `,
      userId
    );
  } catch (error) {
    throw Error(`notifications repository [getUserById]:${error}`);
  }
}

async function getAttendancesNotification(userId, page, limit) {
  try {
    return await pg(
      false,
      `
    select * from attendances_notifications where user_id = $1 order by id desc offset ($2 - 1) * $3 fetch next $3 rows only;
  `,
      userId,
      page,
      limit
    );
  } catch (error) {
    throw Error(`notifications repository [getAttendancesNotification]:${error}`);
  }
}

async function verifyAttendanceNotification(notificationId) {
  try {
    return await pg(
      true,
      `
    update attendances_notifications set is_verified = true where id = $1 returning *;
  `,
      notificationId
    );
  } catch (error) {
    throw Error(`notifications repository [verifyAttendanceNotification]:${error}`);
  }
}

async function getAttendanceNotificationById(notificationId) {
  try {
    return await pg(
      false,
      `
    select * from attendances_notifications where id = $1;
  `,
      notificationId
    );
  } catch (error) {
    throw Error(`notifications repository [getAttendanceNotificationById]:${error}`);
  }
}

module.exports = {
  isSuperAdmin,
  isAdmin,
  getBranchIdByLessonId,
  insertNotification,
  getAttendancesNotification,
  getUserById,
  getLessonById,
  verifyAttendanceNotification,
  getAttendanceNotificationById
};
