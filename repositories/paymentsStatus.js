const pg = require('../utils/pg');

class PaymentsStatusRepository {
  static async getPaymentsStatus() {
    try {
      return await pg(
        false,
        `
          SELECT
            ps.id,
            ps.created_at,
            ps.updated_at,
            ps.user_id,
            ps.stage_id,
            ps.status,
            ps.amount
          FROM
            payments_status as ps
          ORDER BY
            created_at;
        `
      );
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[getPaymentsStatus]:${error}`);
    }
  }

  static async addPaymentStatus(studentId, stageId, status, amount, unpaid) {
    try {
      return await pg(
        true,
        `
          insert into payments_status(student_id, stage_id, status, amount, unpaid_amount) values($1, $2, $3, $4, $5) returning *;
        `,
        studentId,
        stageId,
        status,
        amount,
        unpaid
      );
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[addPaymentStatus]:${error}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const find = 'select * from payments_status where user_id = $1';
      return await pg(true, find, userId);
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[findByStudentId]:${error}`);
    }
  }

  static async updatePaymentStatus(userId, updatedAt) {
    try {
      // prettier-ignore
      const update = "update payments_status set updated_at = $1, status = 'paid' where user_id = $2 returning *";
      return await pg(true, update, updatedAt, userId);
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[updatePaymentStatus]:${error}`);
    }
  }

  static async updatePaymentStatusById(id, updatedAt) {
    try {
      // prettier-ignore
      const update = "update payments_status set updated_at = $1, status = 'paid' where id = $2 returning *";
      return await pg(true, update, updatedAt, id);
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[updatePaymentStatus]:${error}`);
    }
  }

  static async getPendingPayments() {
    try {
      return await pg(
        false,
        "SELECT * FROM payments_status WHERE status = 'pending' order by id desc;"
      );
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[getPendingPayments]:${error}`);
    }
  }

  static async getPendingByCourseId(userId, courseId) {
    try {
      return await pg(
        false,
        `
          SELECT
            ps.id,
            ps.created_at,
            ps.user_id,
            ps.student_id,
            ps.stage_id,
            ps.status,
            ps.amount
          FROM
            payments_status as ps
          JOIN
            students as s on ps.student_id = s.id
          JOIN
            groups as g on s.group_id = g.id
          JOIN
            courses as c on g.course_id = c.id
          WHERE
            ps.status = 'pending' and c.id = $1 and ps.user_id = $2
          ORDER BY
            id desc;
        `,
        courseId,
        userId
      );
    } catch (error) {
      throw new Error(`[PaymentsStatusRepository]:[getPendingByCourseId]:${error}`);
    }
  }

  static async getPaymentsStatusByStudentId(studentId) {
    const query = 'select * from payments_status where student_id = $1';

    const data = await pg(false, query, studentId);

    return data;
  }

  static async findByStudentIdAndStageId(studentId, stageId) {
    const query = 'select * from payments_status where student_id = $1 and stage_id = $2';

    const data = await pg(true, query, studentId, stageId);

    return data;
  }

  static async changePaymentStatus(studentId, stageId, amount, unpaid, status) {
    await pg(
      true,
      'update payments_status set amount = $1, unpaid_amount = $2, status = $5 where student_id = $3 and stage_id = $4;',
      amount,
      unpaid,
      studentId,
      stageId,
      status
    );
  }

  static async getPaidStagesByStudentId(studentId) {
    const data = await pg(
      false,
      `
        select * from payments_status as ps join group_stages as gs on gs.id = ps.stage_id where student_id = $1 and ps.status in ('paid_full', 'paid_partial');
      `,
      studentId
    );
    return data;
  }

  static async sumOfPaidPaymentAmount(studentId) {
    const { sum } = await pg(
      true,
      `
        select sum(amount) as sum from payments_status where student_id = $1;
      `,
      studentId
    );

    return sum;
  }
}

module.exports = PaymentsStatusRepository;
