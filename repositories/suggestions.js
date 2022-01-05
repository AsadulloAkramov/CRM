const pg = require('../utils/pg');

class SuggestionsRepository {
  static async getSuggestionById(id) {
    try {
      return await pg(
        true,
        `
        select * from suggestions
        where id = $1
          `,
        id
      );
    } catch (error) {
      throw new Error(`[SuggestionsRepository]:[getSuggestionById]:${error}`);
    }
  }

  static async getSuggestions(params) {
    try {
      // prettier-ignore
      const {
        branchId, courseId, statusName, date, page = 1, limit = 15
      } = params;

      const whereFields = {
        branchId: ` and b.id = ${branchId} `,
        courseId: ` and c.id = ${courseId} `,
        statusName: ` and sg.status = '${statusName}' `,
        date: ` and to_char(sg.created_at, 'YYYY-MM-DD') = '${date}' `
      };

      let selectQuery = `
        select
          sg.id,
          sg.created_at,
          b.id as branch_id,
          c.id as course_id,
          sg.student_id,
          sg.status,
          sg.text,
          sg.answer
        from
          suggestions as sg
          join students as s on sg.student_id = s.id
          join groups as g on s.group_id = g.id
          join rooms as r on g.room_id = r.id
          join branches as b on r.branch_id = b.id
          join courses as c on g.course_id = c.id
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
      const offset = ' order by sg.id desc offset ($1 - 1) * $2 fetch next $2 rows only;';
      selectQuery += offset;

      return await pg(false, selectQuery, page, limit);
    } catch (error) {
      throw new Error(`[SuggestionsRepository]:[getSuggestions]:${error}`);
    }
  }

  static async answerSuggestion(id, answer) {
    try {
      return await pg(
        true,
        `
          update suggestions set answer = $1 where id = $2 returning *;
        `,
        answer,
        id
      );
    } catch (error) {
      throw new Error(`[SuggestionsRepository]:[answerSuggestion]:${error}`);
    }
  }

  static async changeSuggestionStatus(id, statusName) {
    try {
      return await pg(
        true,
        `
          update suggestions set status = $1 where id = $2 returning *;
        `,
        statusName,
        id
      );
    } catch (error) {
      throw new Error(`[SuggestionsRepository]:[changeSuggestionStatus]:${error}`);
    }
  }
}

module.exports = SuggestionsRepository;
