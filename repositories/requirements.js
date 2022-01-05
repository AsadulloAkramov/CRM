const pg = require('../utils/pg');

class RequirementsRepository {
  static async getRequirementById(id) {
    try {
      return await pg(
        true,
        `
        select * from requirements
        where id = $1 order by id desc
          `,
        id
      );
    } catch (error) {
      throw new Error(`[RequirementsRepository]:[getRequirementById]:${error}`);
    }
  }

  static async getRequirements(params) {
    try {
      // prettier-ignore
      const {
        branchId, courseId, statusName, topicId, date, page = 1, limit = 15
      } = params;

      const whereFields = {
        branchId: ` and b.id = ${branchId} `,
        courseId: ` and c.id = ${courseId} `,
        statusName: ` and rq.status = '${statusName}' `,
        topicId: ` and rq.topic_id = '${topicId}' `,
        date: ` and to_char(rq.created_at, 'YYYY-MM-DD') = '${date}' `
      };

      let selectQuery = `
        select
          rq.id,
          rq.created_at,
          b.id as branch_id,
          c.id as course_id,
          rq.student_id,
          rq.status,
          rq.topic_id,
          rq.text,
          rq.answer
        from
          requirements as rq
          left join students as s on rq.student_id = s.id
          left join groups as g on s.group_id = g.id
          left join rooms as r on g.room_id = r.id
          left join branches as b on r.branch_id = b.id
          left join courses as c on g.course_id = c.id
        where
        1=1
      `;

      let whereQuery = '';

      Object.keys(whereFields).forEach((key) => {
        if (params[key]) {
          whereQuery += `${whereFields[key]}`;
        }
      });

      selectQuery += whereQuery;
      const offset = ' order by rq.id desc offset ($1 - 1) * $2 fetch next $2 rows only;';
      selectQuery += offset;

      return await pg(false, selectQuery, page, limit);
    } catch (error) {
      throw new Error(`[
        RequirementsRepository]:[getRequirements]:${error}`);
    }
  }

  static async answerRequirement(id, answer) {
    try {
      return await pg(
        true,
        `
          update requirements set answer = $1 where id = $2 returning *;
        `,
        answer,
        id
      );
    } catch (error) {
      throw new Error(`[RequirementsRepository]:[answerRequirement]:${error}`);
    }
  }

  static async changeRequirementStatus(id, statusName) {
    try {
      return await pg(
        true,
        `
          update requirements set status = $1 where id = $2 returning *;
        `,
        statusName,
        id
      );
    } catch (error) {
      throw new Error(`[RequirementsRepository]:[changeRequirementStatus]:${error}`);
    }
  }
}

module.exports = RequirementsRepository;
