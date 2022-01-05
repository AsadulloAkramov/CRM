const pg = require('../utils/pg');

async function getStudentById(studentId) {
  try {
    return await pg(
      true,
      `
    select * from students where is_active = true and id = $1;
  `,
      studentId
    );
  } catch (error) {
    throw Error(`marks repository [getStudentById]:${error}`);
  }
}

async function getTeacherByUserId(userId) {
  try {
    return await pg(
      true,
      `
    select * from teachers where user_id = $1;
  `,
      userId
    );
  } catch (error) {
    throw Error(`marks repository [getTeacherByUserId]:${error}`);
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
    throw Error(`marks repository [getLessonById]:${error}`);
  }
}

async function isStudentMarked(lessonId, studentId) {
  try {
    return await pg(
      true,
      `
    select * from students_marks where lesson_id = $1 and student_id = $2;
  `,
      lessonId,
      studentId
    );
  } catch (error) {
    throw Error(`marks repository [isStudentMarked]:${error}`);
  }
}
async function insertStudentMark(studentId, lessonId, userId, mark) {
  try {
    return await pg(
      true,
      `
    insert into students_marks(
      student_id,
      lesson_id,
      teacher_id,
      mark
    ) values(
      $1, $2, (select id from teachers where user_id = $3), $4
    ) returning *;
  `,
      studentId,
      lessonId,
      userId,
      mark
    );
  } catch (error) {
    throw Error(`marks repository [insertStudentMark]:${error}`);
  }
}
async function getTeacherById(teacherId) {
  try {
    return await pg(
      true,
      `
    select * from teachers where id = $1;
  `,
      teacherId
    );
  } catch (error) {
    throw Error(`marks repository [getTeacherById]:${error}`);
  }
}

module.exports = {
  getStudentById,
  getTeacherByUserId,
  getLessonById,
  isStudentMarked,
  insertStudentMark,
  getTeacherById
};
