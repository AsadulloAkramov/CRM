/* eslint-disable no-param-reassign */
const pg = require('../utils/pg');
const { ROLES } = require('../config/index');
const AttandancesNotifications = require('../mongodb/models/attandancesNotifications');
const GroupsService = require('../modules/groups/service');
const LessonsService = require('../modules/lessons/service');
const StudentsService = require('../modules/students/service');

async function getStudentById(studentId) {
  try {
    return await pg(
      true,
      `select * from students 
      where id = $1 and is_active = 'true';`,
      studentId
    );
  } catch (error) {
    throw Error(`Attendances repository [getStudentById]:${error}`);
  }
}

async function getLessonById(lessonId) {
  try {
    return await pg(true, 'select * from lessons where id = $1;', lessonId);
  } catch (error) {
    throw Error(`Attendances repository [getLessonById]:${error}`);
  }
}

async function getAttendanceReasonByName(name) {
  try {
    return await pg(true, 'select * from attendance_reasons where name = $1;', name);
  } catch (error) {
    throw Error(`Attendances repository [getAttendanceReasonByName]:${error}`);
  }
}

async function getPermissionById(userId) {
  try {
    return await pg(false, 'select * from permissions where user_id = $1', userId);
  } catch (error) {
    throw Error(`Attendances repository [getPermissionById]:${error}`);
  }
}

async function adminAndSuperAdminId(admin, superAdmin) {
  try {
    return await pg(
      false,
      'select id from roles where is_active = true and name in ($1, $2);',
      admin,
      superAdmin
    );
  } catch (error) {
    throw Error(`Attendances repository [adminAndSuperAdminId]:${error}`);
  }
}

async function getPermissions(userId) {
  try {
    return await pg(false, 'select * from permissions where user_id = $1', userId);
  } catch (error) {
    throw Error(`Attendances repository [getPermissions]:${error}`);
  }
}

async function updateAttendance(isCome, isLated, studentId, lessonId) {
  try {
    return await pg(
      true,
      'update attendances set is_come = $1, is_lated = $2  where student_id = $3 and lesson_id = $4 returning *;',
      isCome,
      isLated,
      studentId,
      lessonId
    );
  } catch (error) {
    throw Error(`Attendances repository [updateAttendance]:${error}`);
  }
}

async function getStudentStatusFromAttendance(studentId, lessonId) {
  try {
    return await pg(
      true,
      'select * from attendances where student_id = $1 and lesson_id = $2;',
      studentId,
      lessonId
    );
  } catch (error) {
    throw Error(`Attendances repository [getStudentStatusFromAttendance]:${error}`);
  }
}

async function saveLessonAttendance(lessonId) {
  try {
    return await pg(
      true,
      'update lessons set attendance_finished = true where id = $1 returning *;',
      lessonId
    );
  } catch (error) {
    throw (Error(`Attendances repository [saveLessonAttendance]:${error}`), lessonId);
  }
}

async function insertAttendanceReason(name) {
  try {
    return await pg(
      true,
      `insert into attendance_reasons(
      name
    ) values(
      $1
    ) returning *;`,
      name
    );
  } catch (error) {
    throw Error(`Attendances repository [insertAttendanceReason]:${error}`);
  }
}

async function getReasonById(reasonId) {
  try {
    return await pg(true, 'select * from attendance_reasons where id = $1;', reasonId);
  } catch (error) {
    throw Error(`Attendances repository [getReasonById]:${error}`);
  }
}

async function updateAttendanceStatus(reasonId, lessonId, studentId) {
  try {
    return await pg(
      true,
      'update attendances set reason_id = $1 where lesson_id = $2 and student_id = $3 returning *;',
      reasonId,
      lessonId,
      studentId
    );
  } catch (error) {
    throw Error(`Attendances repository [updateAttendanceStatus]:${error}`);
  }
}

async function getAttendaceDetails(lessonId, studentId) {
  try {
    return await pg(
      true,
      'select * from attendances where lesson_id = $1 and student_id = $2;',
      lessonId,
      studentId
    );
  } catch (error) {
    throw Error(`Attendances repository [getAttendaceDetails]:${error}`);
  }
}

async function getGroupById(groupId) {
  try {
    return await pg(
      true,
      `
        select * from groups where id = $1 and status not in ('closed', 'deleted', 'queue') = true;
      `,
      groupId
    );
  } catch (error) {
    throw Error(`Attendances repository [getGroupById]:${error}`);
  }
}

async function getMonthlyLessons(groupId, month, year) {
  try {
    return await pg(
      false,
      `
        select
          *,
          to_char(created_at, 'YYYY-MM-DD') as created_at
        from
          lessons
        where
          group_id = $1
        and
          to_char(created_at, 'MM') = $2
        and
          to_char(created_at, 'YYYY') = $3;
      `,
      groupId,
      month,
      year
    );
  } catch (error) {
    throw Error(`Attendances repository [getMonthlyLessons]:${error}`);
  }
}

async function getStudentsByGroupId(groupId) {
  try {
    return await pg(
      false,
      `select
      s.id,
      s.created_at,
      s.discount,
      s.group_id,
      s.user_id,
      s.is_active,
      u.first_name,
      u.last_name,
      u.phone_number
    from
      students as s
      join users as u on s.user_id = u.id
    where
      s.group_id = $1
      and s.is_active = 'true';`,
      groupId
    );
  } catch (error) {
    throw Error(`Attendances repository [getStudentsByGroupId]:${error}`);
  }
}

async function wasTheStudentInLesson(lessonId, students) {
  try {
    return await pg(
      true,
      'select * from attendances where lesson_id = $1 and student_id = $2;',
      lessonId,
      students
    );
  } catch (error) {
    throw Error(`Attendances repository [wasTheStudentInLesson]:${error}`);
  }
}

async function getAttendanceByLessonId(lessonId) {
  try {
    return await pg(
      false,
      'select * from attendances where lesson_id = $1 order by id asc;',
      lessonId
    );
  } catch (error) {
    throw Error(`Attendances repository [getAttendanceByLessonId]:${error}`);
  }
}

async function getAttendanceByLessonIdForAdmins(lessonId) {
  try {
    return await pg(
      false,
      'select * from attendances where lesson_id = $1 and is_come = false;',
      lessonId
    );
  } catch (error) {
    throw Error(`Attendances repository [getAttendanceByLessonIdForAdmins]:${error}`);
  }
}

async function getMarkByLessonIdAndStudentId(lessonId, studentId) {
  try {
    return await pg(
      true,
      'select mark from students_marks where lesson_id = $1 and student_id = $2;',
      lessonId,
      studentId
    );
  } catch (error) {
    throw Error(`Attendances repository [getMarkByLessonIdAndStudentId]:${error}`);
  }
}

async function getAttendanceReasons() {
  try {
    return await pg(false, 'select * from attendance_reasons order by id desc;');
  } catch (error) {
    throw Error(`Attendances repository [getAttendanceReasons]:${error}`);
  }
}

async function getSuperAdmins() {
  try {
    return await pg(
      false,
      `
      select
        u.id
      from permissions as p
      join roles as r on p.role_id = r.id
      join users as u on p.user_id = u.id
      where r.name = '${ROLES.superAdmin}';

    `
    );
  } catch (error) {
    throw Error(`attandancesNotification [getSuperAdmins]:${error}`);
  }
}

async function getAdmins() {
  try {
    return await pg(
      false,
      `
        select
          u.id
        from permissions as p
        join roles as r on p.role_id = r.id
        join users as u on p.user_id = u.id
        where r.name = '${ROLES.admin}';
      `
    );
  } catch (error) {
    throw Error(`attandancesNotification [getAdmins]:${error}`);
  }
}

async function completedAttendance(lessonId) {
  const allAdmins = [];

  const superAdmins = await getSuperAdmins();
  const admins = await getAdmins();

  [...superAdmins, ...admins].forEach((v) => {
    // eslint-disable-next-line no-unused-expressions
    !allAdmins.includes(v.id) ? allAdmins.push(v.id) : null;
  });

  allAdmins.forEach(async (user) => {
    const notification = new AttandancesNotifications({
      reciverId: user,
      lessonId
    });
    await notification.save();
  });

  return allAdmins;
}

const getStudents = async (groupId, year, month, date) => {
  try {
    let time = '';
    if (month < 10) {
      time = `${year}-0${month}-${date}`;
    } else {
      time = `${year}-${month}-${date}`;
    }

    return await pg(
      false,
      `
    select
        b.id as branch_id,
        g.id as group_id,
        a.id as attandance_id,
        a.created_at as acreated_at,
        a.student_id as student_id,
    a.is_come as is_come
    from branches as b
    join rooms as r on r.branch_id = b.id
    join groups as g on g.room_id = r.id
    join lessons as l on l.group_id = g.id
    join attendances as a on a.lesson_id = l.id
    where g.id = ${groupId}
    and to_char(a.created_at, 'YYYY-MM-DD') = '${time}'
    ;
`
    );
  } catch (error) {
    throw Error(`attandancesNotification [getStudents]:${error}`);
  }
};

const getAttendancesDetailsByFilter = async (branchId, year, month, date) => {
  const newDate = new Date();

  newDate.setFullYear(year);
  newDate.setMonth(month - 1);
  newDate.setDate(date);

  const day = newDate.getDay();

  let isDateOdd = 'sunday';
  let dayOfWeek = 0;

  if (day) {
    dayOfWeek = day;
    if (day % 2 !== 0) {
      isDateOdd = true;
    } else {
      isDateOdd = false;
    }
  }

  const groups = await GroupsService.findByBranchId(branchId, isDateOdd, dayOfWeek);

  const groupsIds = await groups.map((g) => g.id);
  const studentsCount = await GroupsService.findStudentsCountByIds(groupsIds);

  const groupsWhichIsCreateLesson = await LessonsService.findLessonsStatusOfGroup(
    groupsIds,
    year,
    month,
    date
  );

  const attendancesDetails = [];

  groups.forEach((g, i) => {
    g.lesson = null;
    g.allStudentsCount = studentsCount[i] - 0;
    attendancesDetails.push(g);
  });

  for (let i = 0; i < groupsWhichIsCreateLesson.length; i += 1) {
    const index = groups.findIndex((g) => g.id === groupsWhichIsCreateLesson[i].group_id);
    groups[index].lesson = groupsWhichIsCreateLesson[i];
    // eslint-disable-next-line no-await-in-loop
    groups[index].absentStudentsCount = await LessonsService.findAbsentStudentsCount(
      groupsWhichIsCreateLesson[i].id
    );
  }
  return Promise.all(groups);
};

const addAttendanceDefault = async (lesson) => {
  try {
    const { id, group_id } = lesson;

    const students = await StudentsService.findByGroupId(group_id);

    if (!students.length) {
      return null;
    }

    let query = 'insert into attendances(student_id, lesson_id, is_come) values';

    for (let i = 0; i < students.length; i += 1) {
      if (i === 0) {
        query += ` (${students[i].id}, ${id}, true)`;
      } else {
        query += `, (${students[i].id}, ${id}, true)`;
      }
    }
    return await pg(true, `${query};`);
  } catch (error) {
    throw Error(`attandancesNotification [addAttendanceDefault]:${error}`);
  }
};

const getMonthlyAttendance = async (monthlyLessons, students) => {
  let lessons = {};

  for (let i = 0; i < monthlyLessons.length; i += 1) {
    lessons[monthlyLessons[i].created_at] = monthlyLessons[i];
  }

  lessons = Object.values(lessons);

  const result = [];

  for (let i = 0; i < lessons.length; i += 1) {
    result.push({
      lesson: lessons[i],
      attendances: []
    });

    if (lessons[i].status === 'canceled') {
      // eslint-disable-next-line no-continue
      continue;
    }

    for (let k = 0; k < students.length; k += 1) {
      result[i].attendances.push({
        firstName: students[k].first_name,
        lastName: students[k].last_name,
        phoneNumber: students[k].phone_number
      });

      // eslint-disable-next-line no-await-in-loop
      const attendance = await pg(
        true,
        'select * from attendances where lesson_id = $1 and student_id = $2 and is_come = true',
        lessons[i].id,
        students[k].id
      );

      if (!attendance) {
        result[i].attendances[k].isCome = false;
      } else {
        result[i].attendances[k].isCome = true;
      }
    }
  }

  return result;
};

const deleteByLessonId = async (lessonId) => {
  const query = `
    delete from attendances where lesson_id = $1;
  `;

  await pg(true, query, lessonId);
};

const findStudentAttendedLessonsCount = async (studentId) => {
  const { count } = await pg(
    true,
    `
      select count(id) from attendances where student_id = $1 and is_come = true;
    `,
    studentId
  );
  return count;
};

const findStudentNotAttendedLessonsCount = async (studentId) => {
  const { count } = await pg(
    true,
    `
      select count(id) from attendances where student_id = $1 and is_come = false;
    `,
    studentId
  );
  return count;
};

module.exports = {
  deleteByLessonId,
  getMonthlyAttendance,
  getStudentById,
  getLessonById,
  getAttendanceReasonByName,
  updateAttendance,
  getStudentStatusFromAttendance,
  saveLessonAttendance,
  insertAttendanceReason,
  getReasonById,
  updateAttendanceStatus,
  getAttendaceDetails,
  getGroupById,
  getMonthlyLessons,
  getStudentsByGroupId,
  wasTheStudentInLesson,
  getAttendanceByLessonId,
  getAttendanceByLessonIdForAdmins,
  getMarkByLessonIdAndStudentId,
  getAttendanceReasons,
  getPermissions,
  getPermissionById,
  adminAndSuperAdminId,
  completedAttendance,
  getAttendancesDetailsByFilter,
  getStudents,
  addAttendanceDefault,
  findStudentAttendedLessonsCount,
  findStudentNotAttendedLessonsCount
};
