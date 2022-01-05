const pg = require('../utils/pg');

class TeacherSalaryRepository {
  static async getTeacherSalaries(args) {
    try {
      let generateQuery = `
      select * from teacher_salary order by id desc 
    `;

      const variables = [];

      if (args.page && args.limit) {
        generateQuery += 'offset ($1 - 1) * $2 fetch next $2 rows only';
        variables.push(args.page, args.limit);
      }

      return await pg(false, generateQuery, ...variables);
    } catch (error) {
      throw new Error(`[TeacherSalaryRepository]:[getTeacherSalaries]:${error}`);
    }
  }

  static async getTeacherSalaryById(id) {
    try {
      return await pg(true, ' select * from teacher_salary where id = $1', id);
    } catch (error) {
      throw new Error(`[TeacherSalaryRepository]:[getTeacherSalaryById]:${error}`);
    }
  }

  static async insertTeacherSalary(args) {
    try {
      const data = await pg(
        true,
        `insert into teacher_salary (
          teacher_id,
          group_id,
          amount,
          payment_type,
          comment,
          status
        ) values ( $1, $2, $3, $4, $5, $6 ) returning *`,
        args.teacherId,
        args.groupId,
        args.amount,
        args.paymentType,
        args.comment,
        'unconfirmed'
      );
      return data;
    } catch (error) {
      throw new Error(`[TeacherSalaryRepository]:[insertTeacherSalary]:${error}`);
    }
  }

  static async updateTeacherSalary(args) {
    try {
      let generateQuery = `
      UPDATE 
        teacher_salary 
      SET 
        teacher_id = $1, 
        group_id = $2, 
        amount = $3, 
        payment_type = $4, 
        comment = $5`;
      const status = ', status = $6';

      const variables = [args.teacherId, args.groupId, args.amount, args.paymentType, args.comment];

      let where = ' WHERE id = $';

      const returnning = `
      RETURNING
        id,
        teacher_id,
        group_id,
        amount,
        payment_type,
        document_file_name,
        comment,
        status,
        created_at
            `;

      if (args.status) {
        variables.push(args.status);
        variables.push(args.id);
        generateQuery += status;
        where += 7;
      } else {
        variables.push(args.id);
        where += 6;
      }
      generateQuery += where + returnning;

      return pg(true, generateQuery, ...variables);
    } catch (error) {
      throw new Error(`Teacher Salary repository [updateTeacherSalary]: ${error.message}`);
    }
  }

  static async updateTeacherSalaryImage(file, id) {
    try {
      return await pg(
        true,
        'update teacher_salary set document_file_name = $1 where id = $2 returning *;',
        file,
        id
      );
    } catch (error) {
      throw new Error(`[TeacherSalaryRepository]:[updateTeacherSalaryImage]:${error}`);
    }
  }

  static async getTeacherSalaryImage(id) {
    try {
      const file = await pg(
        true,
        `
        select document_file_name
         from teacher_salary
        where id = $1
      `,
        id
      );
      return file;
    } catch (error) {
      throw new Error(`[TeacherSalaryRepository]:[getTeacherSalaryImage]:${error}`);
    }
  }

  static async updateTeacherSalaryStatus(id, status) {
    try {
      return await pg(
        true,
        'update teacher_salary set status = $1 where id = $2 returning *',
        status,
        id
      );
    } catch (error) {
      throw new Error(`[TeacherSalaryRepository]:[updateTeacherSalaryStatus]:${error}`);
    }
  }
}

module.exports = TeacherSalaryRepository;
