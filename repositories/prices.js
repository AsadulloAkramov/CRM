const pg = require('../utils/pg');

class PricesRepository {
  static async getPrices() {
    try {
      return await pg(
        false,
        `
        select * from prices
        order by id desc;
        `
      );
    } catch (error) {
      throw new Error(`[PricesRepository]:[getPrices]:${error}`);
    }
  }

  static async getPricesById(id) {
    try {
      return await pg(
        true,
        `
          select * from prices
          where id = $1;
        `,
        id
      );
    } catch (error) {
      throw new Error(`[PricesRepository]:[getPricesById]:${error}`);
    }
  }

  static async getPricesByCourseId(courseId) {
    try {
      return await pg(
        false,
        `
          select * from prices
          where course_id = $1;
        `,
        courseId
      );
    } catch (error) {
      throw new Error(`[PricesRepository]:[getPricesByCourseId]:${error}`);
    }
  }

  static async addPrice(args) {
    try {
      return await pg(
        true,
        `
          INSERT INTO
            prices(
              all_payment,
              half_payment,
              monthly_payment,
              test_month_payment,
              course_id
            )
          VALUES(
            $1, $2, $3, $4, $5
          ) returning *;
        `,
        args.allPayment,
        args.halfPayment,
        args.monthlyPayment,
        args.testMonthPayment,
        args.courseId
      );
    } catch (error) {
      throw new Error(`[PricesRepository]:[getPricesById]:${error}`);
    }
  }

  static async updatePrice(args) {
    try {
      const query = `
        update prices set all_payment = $1, half_payment = $2, monthly_payment = $3, test_month_payment = $4, course_id = $5  where id = $6 returning *;
      `;
      return await pg(
        true,
        query,
        args.allPayment,
        args.halfPayment,
        args.monthlyPayment,
        args.testMonthPayment,
        args.courseId,
        args.priceId
      );
    } catch (error) {
      throw new Error(`[PricesRepository]:[updatePrice]:${error}`);
    }
  }
}

module.exports = PricesRepository;
