const pg = require('../utils/pg');

async function createExpense(expenseTypeId, reciverId, amount, method, comment, adminId, branchId) {
  try {
    return await pg(
      true,
      `
      insert into expenses(expense_id, reciver_id, amount, method, comment, admin_id, branch_id) values($1,$2,$3,$4,$5,$6,$7) returning *;
    `,
      expenseTypeId,
      reciverId,
      amount,
      method,
      comment,
      adminId,
      branchId
    );
  } catch (error) {
    throw Error(`expense modules repository [createExpense]:${error}`);
  }
}

async function getExpenseById(id) {
  try {
    const expense = await pg(
      true,
      `
          select * from expenses where active = true and id = $1;
        `,
      id
    );
    return expense;
  } catch (error) {
    throw Error(`expense modules repository [getExpenseById]:${error}`);
  }
}

async function updateExpense(expenseId, reciverId, amount, method, comment, id) {
  try {
    const updateFields = {
      expenseId: ` expense_id = '${expenseId}',`,
      reciverId: `  reciver_id = '${reciverId}',`,
      amount: `  amount = '${amount}',`,
      method: `  amount = '${method}',`,
      comment: `  comment = '${comment}',`
    };

    let query = 'update expenses set';
    const whereField = ` where id = ${id} returning *`;

    if (expenseId) {
      query += updateFields.expenseId;
    }

    if (reciverId) {
      query += updateFields.reciverId;
    }

    if (amount) {
      query += updateFields.amount;
    }

    if (method) {
      query += updateFields.method;
    }

    if (comment) {
      query += updateFields.comment;
    }

    query = query.substring(0, query.length - 1);
    query += whereField;

    return pg(true, query);
  } catch (error) {
    throw Error(`expense modules repository [updateExpense]:${error}`);
  }
}

async function deleteExpense(id) {
  try {
    const expense = await pg(
      true,
      `
          update expenses set active = false where id = $1 returning *;
        `,
      id
    );
    return expense;
  } catch (error) {
    throw Error(`expense modules repository [deleteExpense]:${error}`);
  }
}

async function getExpenses(args) {
  try {
    const {
      adminId,
      branchId,
      expenseId,
      date,
      page,

      limit
    } = args;

    const whereFields = {
      adminId: ` and admin_id = ${adminId}`,
      branchId: `  and branch_id = '${branchId}'`,
      expenseId: ` and expense_id = '${expenseId}'`,
      date: ` and to_char(created_at, 'YYYY-MM-DD') = '${date}'`
    };

    let query = 'select * from expenses where 1=1 and active = true';
    const pagination = ` order by id desc offset (${page} - 1) * ${limit} fetch next ${limit} rows only;`;

    if (adminId) {
      query += whereFields.adminId;
    }

    if (branchId) {
      query += whereFields.branchId;
    }

    if (expenseId) {
      query += whereFields.expenseId;
    }

    if (date) {
      query += whereFields.date;
    }

    query += pagination;

    return pg(false, query);
  } catch (error) {
    throw Error(`expense modules repository [getExpenses]:${error}`);
  }
}

module.exports = {
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenses
};
