/* eslint-disable no-return-await */
const pg = require('../utils/pg');

const setLessonStatus = async (lessonId, status) => {
  const update = 'update lessons set status = $1 where id = $2';

  return await pg(true, update, status, lessonId);
};

async function getGroupById(groupId) {
  try {
    return await pg(
      true,
      `
        select * from groups where id = $1;
      `,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [getGroupById]:${error}`);
  }
}

async function insertLesson(name, groupId) {
  try {
    return await pg(
      true,
      `
    insert into lessons(
      name,
      group_id
    ) values(
      $1, $2
    ) returning *;
  `,
      name,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [insertLesson]:${error}`);
  }
}

async function checkThatOneDayHasPassed(lessonIsCreatingAt, groupId) {
  try {
    return await pg(
      true,
      `
    select
    $1 > (
      select
        created_at::date as last_lesson_created_at
      from
        lessons
      where
        group_id = $2
      order by
        id desc
      limit
        1
    ) is_one_day_has_passed;
  `,
      lessonIsCreatingAt,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [checkThatOneDayHasPassed]:${error}`);
  }
}

async function getLessonsCountByGroupId(groupId) {
  try {
    return await pg(
      true,
      `
    select count(id) from lessons where group_id = $1;
  `,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [getLessonsCountByGroupId]:${error}`);
  }
}

async function getLessonById(id) {
  try {
    return await pg(
      true,
      `
    select * from lessons where id = $1;
  `,
      id
    );
  } catch (error) {
    throw Error(`lessons repository [getLessonById]:${error}`);
  }
}

async function isCompletedLesson(id) {
  try {
    return await pg(
      true,
      `
    select * from lessons where id = $1 and ended_at is null;
  `,
      id
    );
  } catch (error) {
    throw Error(`lessons repository [isCompletedLesson]:${error}`);
  }
}

async function getStudentsByGroupId(groupId) {
  try {
    return await pg(
      false,
      `
    select
      u.id,
      u.first_name,
      u.last_name,
      u.telegram_id
    from
      students as s
      join users as u on u.id = s.user_id
    where
      s.is_active = 'true'
    and
      s.group_id = $1;
  `,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [getStudentsByGroupId]:${error}`);
  }
}

async function completeLesson(id) {
  try {
    return await pg(
      true,
      `
    update lessons set ended_at = (select NOW()::time) where id = $1 returning *;
  `,
      id
    );
  } catch (error) {
    throw Error(`lessons repository [completeLesson]:${error}`);
  }
}

async function getLessonByGroupId(groupId) {
  try {
    return await pg(
      false,
      `
    select * from lessons where group_id = $1 order by id desc;
  `,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [getLessonByGroupId]:${error}`);
  }
}

async function getAbsentStudents(lessonId, groupId) {
  try {
    return await pg(
      false,
      `
    select
      s.id
    from
      students as s
      join attendances as a on a.student_id = s.id
      and a.lesson_id = $1
    where
      s.is_active = 'true' and s.group_id = $2 and a.is_come = false;
  `,
      lessonId,
      groupId
    );
  } catch (error) {
    throw Error(`lessons repository [getAbsentStudents]:${error}`);
  }
}

const findLessonsStatusOfGroup = async (groupsIds, year, month, date) => {
  try {
    const query = `
      select * from lessons where group_id = any ($1) and
      to_char(created_at, 'YYYY') = $2 and
      to_char(created_at, 'MM') = $3 and
      to_char(created_at, 'DD') = $4
    `;

    return await pg(
      false,
      query,
      groupsIds,
      year,
      String(month).padStart(2, '0'),
      String(date).padStart(2, '0')
    );
  } catch (error) {
    throw new Error(`[LessonsRepository]:[findLessonsStatusOfGroup]:${error}`);
  }
};

const findAbsentStudentsCount = async (lessonId) => {
  try {
    const query = `
      select count(id) from attendances where lesson_id = $1 and is_come = false;
    `;
    return (await pg(true, query, lessonId)).count;
  } catch (error) {
    throw new Error(`[LessonsRepository]:[findAbsentStudentsCount]:${error}`);
  }
};

const cancelLesson = async (date, groupId) => {
  const check = `
    select * from lessons where to_char(created_at, 'YYYY-MM-DD') = $1 and group_id = $2;
  `;

  const lesson = await pg(true, check, date, groupId);

  if (lesson) {
    const deleteAttendances = 'delete from attendances where lesson_id = $1';

    await pg(true, deleteAttendances, lesson.id);

    const updateLessonsStatus = "update lessons set status = 'canceled' where id = $1 returning *";

    return await pg(true, updateLessonsStatus, lesson.id);
  }

  // prettier-ignore
  const addLesson = "insert into lessons(created_at, name, group_id, status) values($1, 'Dars bo`lmadi!', $2, $3) returning *;";

  return await pg(true, addLesson, date, groupId, 'canceled');
};

const getLastLessonByGroupId = async (groupId) => {
  const query = `
    select id, to_char(created_at, 'yyyy-mm-dd') as created_at from lessons where group_id = $1 order by id desc limit 1;
  `;

  return await pg(true, query, groupId);
};

const deleteById = async (lessonId) => {
  const query = `
    delete from lessons where id = $1;
  `;

  await pg(true, query, lessonId);
};

const getLessonsByGroupId = async (groupId) => {
  const query = `
    select * from lessons where group_id = $1;
  `;

  return await pg(false, query, groupId);
};

module.exports = {
  setLessonStatus,
  findAbsentStudentsCount,
  findLessonsStatusOfGroup,
  getGroupById,
  insertLesson,
  checkThatOneDayHasPassed,
  getLessonsCountByGroupId,
  getLessonById,
  isCompletedLesson,
  completeLesson,
  getStudentsByGroupId,
  getLessonByGroupId,
  getAbsentStudents,
  cancelLesson,
  getLastLessonByGroupId,
  deleteById,
  getLessonsByGroupId
};
