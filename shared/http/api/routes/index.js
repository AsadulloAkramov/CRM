const router = require('express').Router();
const ApiDocs = require('../swagger');
const AttendancesRouter = require('../../../../modules/attendances/http/router');
const UsersRouter = require('../../../../modules/users/http/router');
const CoursesRouter = require('../../../../modules/courses/http/router');
const TeacherSalary = require('../../../../modules/teachersSalary/http/router');

router.use('/attendances', AttendancesRouter);
router.use('/api-docs', ApiDocs);
router.use('/users', UsersRouter);
router.use('/courses', CoursesRouter);
router.use('/teacher-salary', TeacherSalary);

module.exports = {
  router
};
