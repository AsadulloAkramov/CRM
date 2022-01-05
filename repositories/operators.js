const pg = require('../utils/pg');

async function createOperator(userId) {
  try {
    return await pg(true, 'insert into operators(user_id) values($1) returning *;', userId);
  } catch (error) {
    throw Error(`operastors repository [createOperator]:${error}`);
  }
}

async function getUserById(userId) {
  try {
    return await pg(true, 'select * from users where is_active = true and id = $1', userId);
  } catch (error) {
    throw Error(`operastors repository [getUserById]:${error}`);
  }
}

module.exports = {
  createOperator,
  getUserById
};
