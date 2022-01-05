/* eslint-disable operator-linebreak */
const pg = require('../utils/pg');

async function getLeadInterestedCourseById(id) {
  try {
    return await pg(
      true,
      'select * from lead_interested_courses where id = $1 and is_active = true;',
      id
    );
  } catch (error) {
    throw Error(`leadInterestedCourses repository [getLeadInterestedCoursesById]:${error}`);
  }
}

async function getLeadInterestedCourses() {
  try {
    return await pg(false, 'select * from lead_interested_courses where is_active = true');
  } catch (error) {
    throw Error(`leadInterestedCourses repository [getLeadInterestedCourses]:${error}`);
  }
}

async function insertLeadInterestedCourse(
  courseId,
  startDate,
  weekDays,
  comment,
  assigneeId,
  lessonStartTime,
  lessonEndTime,
  leadId
) {
  try {
    return await pg(
      true,
      `
      insert into lead_interested_courses(
      course_id,
      start_date,
      weekdays,
      comment,
      assignee_admin_id,
      lesson_start_time,
      lesson_end_time,
      lead_id
    ) values(
      $1, $2, $3, $4, $5, $6, $7, $8
    ) returning *;`,
      courseId,
      startDate,
      weekDays,
      comment,
      assigneeId,
      lessonStartTime,
      lessonEndTime,
      leadId
    );
  } catch (error) {
    throw Error(`leadInterestedCourses repository [insertLeadInterestedCourse]:${error}`);
  }
}

async function updateLeadInterestedCourse(args) {
  try {
    const argsLength = Object.keys(args).length;

    const weekDaysTemplate = {
      odd: [1, 2, 3],
      even: [2, 4, 6],
      workday: [1, 2, 3, 4, 5],
      _1: 1,
      _2: 2,
      _3: 3,
      _4: 4,
      _5: 5,
      _6: 6,
      _7: 7
    };

    let { weekDays } = args;
    if (weekDays) {
      if (weekDays[0] === 'odd') {
        weekDays = [1, 3, 5];
      } else if (weekDays[0] === 'even') {
        weekDays = [2, 4, 6];
      } else if (weekDays[0] === 'workday') {
        weekDays = [1, 2, 3, 4, 5];
      } else {
        for (let i = 0; i < weekDays.length; i += 1) {
          weekDays[i] = weekDaysTemplate[weekDays[i]];
        }
      }
    }

    const updateFields = {
      courseId: ` course_id = ${args.courseId}`,
      startDate: ` start_date = '${args.startDate}'`,
      weekDays: ` weekdays = '{${weekDays}}'`,
      comment: ` comment = '${args.comment}'`,
      lessonStartTime: ` lesson_start_time = '${args.lessonStartTime}'`,
      lessonEndTime: ` lesson_end_time = '${args.lessonEndTime}'`
    };

    let Query = 'update lead_interested_courses set';

    const whereQuery = ` where id = ${args.id} returning *;`;
    let updateQuery = '';

    Object.keys(updateFields).forEach((key, index) => {
      if (args[key]) {
        if (argsLength > 2 && index !== argsLength - 2) {
          updateQuery += `${updateFields[key]},`;
        } else {
          updateQuery += `${updateFields[key]},`;
        }
      }
    });

    Query += updateQuery;
    let query = Query.substring(0, Query.length - 1);
    query += whereQuery;
    return await pg(true, query);
  } catch (error) {
    throw Error(`leadInterestedCourses repository [updateLeadInterestedCourse]:${error}`);
  }
}

async function deleteLeadInterestedCourse(id) {
  try {
    return await pg(
      true,
      'update lead_interested_courses set is_active = false where id = $1 returning *;',
      id
    );
  } catch (error) {
    throw Error(`leadInterestedCourses repository [deleteLeadInterestedCourse]:${error}`);
  }
}

async function getLeadInterestedCoursesByLeadId(id) {
  try {
    return await pg(
      false,
      'select * from lead_interested_courses where lead_id = $1 and is_active = true order by id desc;',
      id
    );
  } catch (error) {
    throw Error(`leadInterestedCourses repository [getLeadInterestedCoursesByLeadId]:${error}`);
  }
}

module.exports = {
  getLeadInterestedCourseById,
  getLeadInterestedCourses,
  insertLeadInterestedCourse,
  updateLeadInterestedCourse,
  deleteLeadInterestedCourse,
  getLeadInterestedCoursesByLeadId
};
