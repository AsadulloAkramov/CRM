const pg = require('../utils/pg');

class DepositsRepository {
  static async addDeposit(payerUserId, amount) {
    try {
      const checkDeposit = `
        select * from deposits where user_id = $1
      `;

      const deposit = await pg(true, checkDeposit, payerUserId);

      if (!deposit) {
        const createDeposit = `
          insert into deposits(amount, user_id) values($1, $2) returning *;
        `;
        return await pg(true, createDeposit, amount, payerUserId);
      }

      const updateDeposit = `
        update deposits set amount = amount + $1 where user_id = $2 returning *;
      `;
      return await pg(true, updateDeposit, amount, payerUserId);
    } catch (error) {
      throw new Error(`[DepositsRepository]:[addDeposit]:${error}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const find = 'select * from deposits where user_id = $1';
      return await pg(true, find, userId);
    } catch (error) {
      throw new Error(`[DepositsRepository]:[findByUserId]:${error}`);
    }
  }

  static async withdraw(userId, amount) {
    try {
      const update = 'update deposits set amount = amount - $1 where user_id = $2 returning *';
      return await pg(true, update, amount, userId);
    } catch (error) {
      throw new Error(`[DepositsRepository]:[withdraw]:${error}`);
    }
  }
}

module.exports = DepositsRepository;
