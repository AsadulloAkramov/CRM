const pg = require('../utils/pg');

async function getFeedbacksFilter(args) {
  try {
    const sql_args = { ...args };
    if (sql_args.month) {
      sql_args.month = String(sql_args.month).padStart(2, '0');
    }
    if (sql_args.date) {
      sql_args.date = String(sql_args.date).padStart(2, '0');
    }
    const options = {
      branchId: ' and b.id = $',
      courseId: ' and c.id = $',
      teacherId: ' and t.teacher_id = $',
      lowMark: ' and t.mark >= $',
      highMark: ' and t.mark <= $',
      status: ' and t.status = $',
      year: " and to_char(t.created_at, 'YYYY') = $",
      month: " and to_char(t.created_at, 'MM') = $",
      date: " and to_char(t.created_at, 'DD') = $"
    };

    let counter = 3;
    let generateQuery = `
    select  
      t.id,
      t.mark,
      t.created_at,
      t.student_id,
      t.description,
      t.teacher_id,
      g.id as group_id,
      b.id as branch_id,
      c.id as course_id,
      t.status
    from 
      teachers_marks t
      join lessons l on l.id = t.lesson_id
      join groups g on g.id = l.group_id
      join rooms r on g.room_id = r.id
      join branches b on b.id = r.branch_id
      left join courses c on c.id = g.course_id

        where
           1 = 1 `;
    const variables = [sql_args.page, sql_args.limit];
    const pagination = ' offset ($1 - 1) * $2 limit $2';

    Object.keys(sql_args).forEach((key) => {
      if (key in options) {
        generateQuery += options[key] + counter;
        variables.push(sql_args[key]);
        counter += 1;
      }
    });

    generateQuery += pagination;
    return pg(false, generateQuery, ...variables);
  } catch (error) {
    throw Error(`Feedbacks repository [getFeedbacksFilter]:${error}`);
  }
}

async function getCountOfFeedbacks() {
  try {
    return await pg(
      true,
      `
      select  count(*) from teachers_marks;
      `
    );
  } catch (error) {
    throw Error(`Feedbacks repository [getCountOfFeedbacks]:${error}`);
  }
}

async function updateFeedbackStatus({ id, status }) {
  try {
    const feadbackStatus = status === 'InProgress' ? 'In Progress' : status;
    return await pg(
      true,
      `
      update teachers_marks set status = $1 where id = $2 returning *;
      `,
      feadbackStatus,
      id
    );
  } catch (error) {
    throw Error(`Feedbacks repository [updateFeedbackStatus]:${error}`);
  }
}

const findfeedbackById = async (id) => {
  try {
    return await pg(true, 'select * from teachers_marks where id = $1', id);
  } catch (error) {
    throw Error(`Feedbacks repository [findfeedbackById]:${error}`);
  }
};

module.exports = {
  getCountOfFeedbacks,
  getFeedbacksFilter,
  updateFeedbackStatus,
  findfeedbackById
};
