const pg = require('../utils/pg');

class CoursesDepositRepository {
  static async add(userId, courseId, amount) {
    try {
      // prettier-ignore
      const checkCourseDeposit = 'select * from courses_deposit where user_id = $1 and course_id = $2;';
      const courseDeposit = await pg(true, checkCourseDeposit, userId, courseId);

      if (!courseDeposit) {
        const add = `insert into courses_deposit(user_id, course_id, amount) values($1, $2, ${amount}) returning *;`;
        return await pg(true, add, userId, courseId);
      }

      return await CoursesDepositRepository.update(userId, courseId, amount);
    } catch (error) {
      throw new Error(`[CoursesDepositRepository]:[add]:${error}`);
    }
  }

  static async update(userId, courseId, amount) {
    try {
      const update = `update courses_deposit set amount = amount + ${amount} where user_id = $1 and course_id = $2 returning *`;
      return await pg(true, update, userId, courseId);
    } catch (error) {
      throw new Error(`[CoursesDepositRepository]:[update]:${error}`);
    }
  }

  static async widthdraw(userId, courseId, amount) {
    try {
      // prettier-ignore
      const findDeposit = 'select * from courses_deposit where user_id = $1 and course_id = $2;';
      const deposit = await pg(true, findDeposit, userId, courseId);

      try {
        if (!deposit) {
          throw new Error(
            JSON.stringify({
              isRejected: true,
              message: 'Deposit not found',
              status: 404,
              calculatedSum: amount
            })
          );
        }

        if (deposit.amount < amount) {
          throw new Error(
            JSON.stringify({
              isRejected: true,
              message: 'Must be deposit.amount >= amount',
              status: 400,
              calculatedSum: amount
            })
          );
        }

        // prettier-ignore
        const widthdraw = 'update courses_deposit set amount = amount - $1 where user_id = $2 and course_id = $3';
        await pg(true, widthdraw, amount, userId, courseId);

        return {
          isRejected: false,
          message: 'Successfully completed',
          status: 200,
          calculatedSum: amount
        };
      } catch (error) {
        return JSON.parse(error.message);
      }
    } catch (error) {
      throw new Error(`[CoursesDepositRepository]:[widthdraw]:${error}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const find = 'select * from courses_deposit where user_id = $1';
      return await pg(true, find, userId);
    } catch (error) {
      throw new Error(`[CoursesDepositRepository]:[findByUserId]:${error}`);
    }
  }

  static async findByUserIdAndCourseId(userId, courseId) {
    const data = await pg(
      true,
      'select * from courses_deposit where user_id = $1 and course_id = $2',
      userId,
      courseId
    );

    return data;
  }
}

module.exports = CoursesDepositRepository;
