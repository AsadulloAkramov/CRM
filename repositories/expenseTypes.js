const pg = require('../utils/pg');

class ExpenseTypesRepository {
  static async getExpenseTypes(page, limit) {
    try {
      let generateQuery = `
        select * from expense_types order by id desc
      `;
      const variables = [];
      if (page && limit) {
        generateQuery += ' offset ($1 - 1) * $2 fetch next $2 rows only';
        variables.push(page, limit);
      }
      return await pg(false, generateQuery, ...variables);
    } catch (error) {
      throw new Error(`[ExpenseTypesRepository]:[getExpenseTypes]:${error}`);
    }
  }

  static async insertExpenseType(name) {
    try {
      return await pg(true, 'insert into expense_types(name) values ( $1 ) returning *;', name);
    } catch (error) {
      throw new Error(`[ExpenseTypesRepository]:[insertExpenseType]:${error}`);
    }
  }

  static async getExpenseTypeById(id) {
    try {
      return await pg(true, 'select * from expense_types where id = $1', id);
    } catch (error) {
      throw new Error(`[ExpenseTypesRepository]:[getExpenseTypeById]:${error}`);
    }
  }

  static async updateExpenseType(name, id) {
    try {
      return await pg(
        true,
        `
        update expense_types 
        set name = $1 
        where id = $2
        returning *;
        `,
        name,
        id
      );
    } catch (error) {
      throw new Error(`[ExpenseTypesRepository]:[updateExpenseType]:${error}`);
    }
  }

  static async deleteExpenseType(id) {
    try {
      return await pg(
        true,
        `
        update expense_types 
        set active = 'false'
        where id = $1
        returning *;
        `,
        id
      );
    } catch (error) {
      throw new Error(`[ExpenseTypesRepository]:[deleteExpenseType]:${error}`);
    }
  }
}

module.exports = ExpenseTypesRepository;
