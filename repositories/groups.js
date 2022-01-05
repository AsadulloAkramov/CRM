/* eslint-disable no-else-return */
const pg = require('../utils/pg');

async function getGroups(page, limit) {
  try {
    return await pg(
      false,
      `
        select
          *
        from
          groups
        where
          status not in ('closed', 'deleted', 'queue')
        order by
          id desc offset ($1 - 1) * $2 fetch next $2 rows only;
      `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`groups repository [getGroups]:${error}`);
  }
}

async function getGroupsByRoomId(roomId, page, limit) {
  try {
    return await pg(
      false,
      `
        select * from groups where status not in ('closed', 'deleted', 'queue') and room_id = $1 order by id desc offset ($2 - 1) * $3 fetch next $3 rows only;
      `,
      roomId,
      page,
      limit
    );
  } catch (error) {
    throw Error(`groups repository [getGroupsByRoomId]:${error}`);
  }
}

async function getGroupsByRoomIdAndTeacherId(roomId, userId, page, limit) {
  try {
    return await pg(
      false,
      `
        select * from groups where status not in ('closed', 'deleted', 'queue') and room_id = $1 and teacher_id = (
          select id from teachers where user_id = $2
        ) order by id desc offset ($3 - 1) * $4 fetch next $4 rows only;;
      `,
      roomId,
      userId,
      page,
      limit
    );
  } catch (error) {
    throw Error(`groups repository [getGroupsByRoomIdAndTeacherId]:${error}`);
  }
}

async function getRoomById(roomId) {
  try {
    return await pg(
      true,
      `
        select * from rooms where id = $1;
      `,
      roomId
    );
  } catch (error) {
    throw Error(`groups repository [getRoomById]:${error}`);
  }
}

async function getTeacherById(teacherId) {
  try {
    return await pg(
      true,
      `
        select * from teachers where id = $1 and status = 'teaching';
      `,
      teacherId
    );
  } catch (error) {
    throw Error(`groups repository [getTeacherById]:${error}`);
  }
}

async function insertGroup(args) {
  try {
    const query = `
      insert into groups(
        name,
        completed_lessons,
        room_id,
        teacher_id,
        course_id,
        lesson_start_time,
        lessons_start_date,
        lesson_days
      ) values(
        $1, $2, $3, $4, $5, $6, $7, $8
      ) returning *;
    `;

    const data = await pg(
      true,
      query,
      args.name,
      args.completedLessons,
      args.roomId,
      args.teacherId,
      args.courseId,
      args.lessonStartTime,
      args.lessonsStartDate,
      args.lessonDays
    );

    return data;
  } catch (error) {
    throw Error(`groups repository [insertGroup]:${error}`);
  }
}

async function getGroupById(id) {
  try {
    return await pg(
      true,
      `
      select * from groups where id = $1 and status not in ('closed');
  `,
      id
    );
  } catch (error) {
    throw Error(`groups repository [getGroupById]:${error}`);
  }
}

async function deleteGroup(id) {
  try {
    return await pg(
      true,
      `
      update groups set status = 'closed' where id = $1 returning *;
  `,
      id
    );
  } catch (error) {
    throw Error(`groups repository [deleteGroup]:${error}`);
  }
}

async function completeGroup(id) {
  try {
    return await pg(
      true,
      `
        update groups set status = 'completed' where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`groups repository [completeGroup]:${error}`);
  }
}

async function updateGroup(
  name,
  teacherId,
  roomId,
  courseId,
  status,
  completedLessons,
  lessonStartTime,
  lessonStartDate,
  lessonDays,
  id
) {
  try {
    return await pg(
      true,
      `
    update groups set name = $1, teacher_id = $2, room_id = $3, course_id = $4, status = $5, completed_lessons = $6, lesson_start_time = $7, lessons_start_date = $8, lesson_days = $9 where id = $10 returning *;
  `,
      name,
      teacherId,
      roomId,
      courseId,
      status,
      completedLessons,
      lessonStartTime,
      lessonStartDate,
      lessonDays,
      id
    );
  } catch (error) {
    throw Error(`groups repository [updateGroup]:${error}`);
  }
}

async function getStudentsCount(id) {
  try {
    return await pg(
      true,
      `
    select count(id) from students where is_active = 'true' and group_id = $1;
  `,
      id
    );
  } catch (error) {
    throw Error(`groups repository [getStudentsCount]:${error}`);
  }
}

async function getGroupsByTeacherId(userId, page, limit) {
  try {
    return await pg(
      false,
      `
        select * from groups where teacher_id = (
          select id from teachers where user_id = $1
        ) and status not in ('closed', 'deleted', 'queue') order by id desc offset ($2 - 1) * $3 fetch next $3 rows only;
      `,
      userId,
      page,
      limit
    );
  } catch (error) {
    throw Error(`groups repository [getGroupsByTeacherId]:${error}`);
  }
}

async function getStudentsByGroupId(id) {
  try {
    return await pg(
      false,
      `
        select * from students where group_id = $1;
      `,
      id
    );
  } catch (error) {
    throw Error(`groups repository [getStudentsByGroupId]:${error}`);
  }
}

async function getTeacherRole(rolesTeacher) {
  try {
    return await pg(
      true,
      `select id from roles where is_active = true and id = (
      select id from roles where name = $1 and is_active = true
    );`,
      rolesTeacher
    );
  } catch (error) {
    throw Error(`groups repository [getTeacherRole]:${error}`);
  }
}

async function getUserPermissions(userId) {
  try {
    return await pg(
      false,
      `select * from permissions where user_id = $1
    `,
      userId
    );
  } catch (error) {
    throw Error(`groups repository [getUserPermissions]:${error}`);
  }
}

const findByBranchId = async (branchId, isDateOdd, dayOfWeek) => {
  try {
    const dateOddQuery = ` 
        and (1 = any(g.lesson_days) and 3 = any(g.lesson_days) and 5 = any(g.lesson_days));
    `;

    const dateEvenQuery = `
        and (2 = any(g.lesson_days) and 4 = any(g.lesson_days) and 6 = any(g.lesson_days));
    `;

    const dateSundayQuery = `
        and (7 = any(g.lesson_days));
    `;

    const dateBootcampQuery = `
        and (2 = any(g.lesson_days) and 4 = any(g.lesson_days));
    `;

    let selectQuery = `
      select 
          g.* 
      from groups as g

    `;

    const whereQuery = `where 1 = 1
    and (g.status != 'closed' and g.status != 'end' and g.status != 'queue')
    `;

    const joinBranchQuery = ` 
    join rooms as r on g.room_id = r.id and r.branch_id = ${branchId}
    `;

    if (branchId) {
      selectQuery += joinBranchQuery;
    }

    selectQuery += whereQuery;

    if (isDateOdd === 'sunday') {
      selectQuery += dateSundayQuery;
      return await pg(false, selectQuery);
    } else if (isDateOdd) {
      selectQuery += dateOddQuery;
      return await pg(false, selectQuery);
    } else {
      if (dayOfWeek > 0 && dayOfWeek < 6) {
        selectQuery += dateBootcampQuery;
        return await pg(false, selectQuery);
      }
      selectQuery += dateEvenQuery;
      return await pg(false, selectQuery);
    }
  } catch (error) {
    throw new Error(`[GroupsRepository]:[findByBranchId]:${error}`);
  }
};

const updateStatus = async (groupId, status) => {
  try {
    const query = `
      update groups set status = $1 where id = $2 returning *;
    `;
    return await pg(true, query, status, groupId);
  } catch (error) {
    throw new Error(`[GroupsRepository]:[updateStatus]:${error}`);
  }
};

const findById = async (groupId) => {
  try {
    const find = 'select * from groups where id = $1';
    return await pg(true, find, groupId);
  } catch (error) {
    throw new Error(`[GroupsRepository]:[findById]:${error}`);
  }
};

const findStudentsCountByIds = async (groupIds) => {
  try {
    const counts = [];

    for (let i = 0; i < groupIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { count } = await pg(
        true,
        `
        select count(id)
        from students 
        where group_id = $1 and is_active = 'true';`,
        groupIds[i]
      );

      counts.push(count);
    }

    return counts;
  } catch (error) {
    throw new Error(`[GroupsRepository]:[findStudentsCountByIds]:${error}`);
  }
};

/**
 * @params userId
 * @params args
 */

const getGroupsByFilter = async (userId, args) => {
  const selectQuery = `
    select
      g.*,
      (
        select count(id) from students where group_id = g.id
      ) as students_count
    from
      groups as g
    full outer join
      courses as c on g.course_id = c.id
    full outer join
      rooms as r on g.room_id = r.id
    where (g.status = 'started' or g.status = 'completed' or g.status = 'queue') and 1 = 1
  `;

  const teacher = await pg(
    true,
    `
      select * from teachers where user_id = $1 and status = 'teaching' order by id desc limit 1
    `,
    userId
  );

  if (teacher?.id) {
    // eslint-disable-next-line no-param-reassign
    args.teacherId = teacher?.id;
  }

  const whereOptions = {
    teacherId: `and g.teacher_id = ${teacher?.id || args.teacherId}`,
    categoryId: `and c.category_id = ${args.categoryId}`,
    branchId: `and r.branch_id = ${args.branchId}`,
    pattern: `and lower(g.name) like '%' || lower('${args.pattern}') || '%'`
  };

  let whereQuery = '';

  Object.keys(args).forEach((key) => {
    if (key !== 'page' && key !== 'limit' && key !== 'studentsCount') {
      whereQuery += ` ${whereOptions[key]}`;
    }
  });

  let generalQuery = selectQuery + whereQuery;

  if (args.studentsCount) {
    generalQuery += ` order by students_count ${args.studentsCount}`;
  } else {
    generalQuery += ' order by id desc';
  }

  generalQuery += ' offset ($1 - 1) * $2 fetch next $2 rows only';

  const data = await pg(false, `${generalQuery};`, args.page, args.limit);
  return data;
};

async function getQueue({ page, limit }) {
  try {
    return await pg(
      false,
      `
      select
        g.*,
        count(s.id) students_count
      from 
        groups g
      left join 
        students s on s.group_id = g.id
      where g.status in ('queue', 'closed')
      group by
        g.id
      offset ($1-1)*$2
      limit $2
      `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`groups repository [getQueueing]:${error}`);
  }
}

const findGroupByIds = (ids) => pg(false, 'select * from groups where id = any ($1)', ids);

async function getQueueByUserId(userId) {
  try {
    return await pg(
      false,
      `
      select g.* 
      from groups as g
      join students as s on s.group_id = g.id
      where s.user_id = $1 and g.status = 'queue' and s.is_active = 'true'
      order by g.id desc
      ;
      `,
      userId
    );
  } catch (error) {
    throw Error(`groups repository [getQueueByUserId]:${error}`);
  }
}

async function getGroupsByPattern(pattern) {
  try {
    return await pg(
      false,
      `
        select
          id,
          created_at,
          name,
          completed_lessons,
          room_id,
          teacher_id,
          status,
          course_id,
          lesson_start_time,
          lessons_start_date,
          lesson_days
        from
          groups
        where
          status in ('queue', 'started')
          and lower(name) like '%' || lower($1) || '%'
      `,
      pattern
    );
  } catch (error) {
    throw Error(`Groups repository [getGroupsByPattern]:${error}`);
  }
}

async function getActiveGroupsByTeacherId(teacherId) {
  try {
    return await pg(
      false,
      `
        select * from groups where teacher_id = $1 and status = 'started';
      `,
      teacherId
    );
  } catch (error) {
    throw Error(`Groups repository [getActiveGroupsByTeacherId]:${error}`);
  }
}

async function getCompletedGroupsByTeacherId(teacherId) {
  try {
    return await pg(
      false,
      `
        select * from groups where teacher_id = $1 and status = 'completed';
      `,
      teacherId
    );
  } catch (error) {
    throw Error(`Groups repository [getActiveGroupsByTeacherId]:${error}`);
  }
}

async function getTeacherGroups(teacherId) {
  try {
    return await pg(
      false,
      `
        select * from groups where status not in ('closed', 'deleted', 'queue') and teacher_id = $1;
      `,
      teacherId
    );
  } catch (error) {
    throw Error(`Groups repository [getTeacherGroups]:${error}`);
  }
}
const increaseCompletedLessons = async (groupId) => {
  await pg(
    true,
    'update groups set completed_lessons = (select completed_lessons from groups where id = $1) + 1 where id = $1',
    groupId
  );
};

const getAllGroups = async () => {
  const groups = await pg(false, 'select * from groups');
  return groups;
};

module.exports = {
  findGroupByIds,
  getGroupsByFilter,
  findStudentsCountByIds,
  findById,
  updateStatus,
  getGroups,
  getGroupsByRoomId,
  getGroupsByRoomIdAndTeacherId,
  getRoomById,
  getTeacherById,
  insertGroup,
  getGroupById,
  deleteGroup,
  completeGroup,
  updateGroup,
  getStudentsCount,
  getGroupsByTeacherId,
  getStudentsByGroupId,
  getTeacherRole,
  getUserPermissions,
  findByBranchId,
  getQueue,
  getQueueByUserId,
  getGroupsByPattern,
  getActiveGroupsByTeacherId,
  getTeacherGroups,
  getCompletedGroupsByTeacherId,
  increaseCompletedLessons,
  getAllGroups
};
