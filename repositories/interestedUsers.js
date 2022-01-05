const pg = require('../utils/pg');

async function insertInterestedUser(userId) {
  try {
    return await pg(
      true,
      `
                insert into interested_users(user_id) values($1) returning *;
            `,
      userId
    );
  } catch (error) {
    throw Error(`interestedUsers repository [insertInterestedUser]:${error}`);
  }
}

async function getInterestedUserByUserId(userId) {
  try {
    return await pg(
      true,
      `
                select * from interested_users where user_id = $1 and status = 'active';
            `,
      userId
    );
  } catch (error) {
    throw Error(`interestedUsers repository [getInterestedUserByUserId]:${error}`);
  }
}

async function getInterestedUserById(id) {
  try {
    return await pg(
      true,
      `
                select * from interested_users where id = $1 and status = 'active';
            `,
      id
    );
  } catch (error) {
    throw Error(`interestedUsers repository [getInterestedUserById]:${error}`);
  }
}

async function updateInterestedUserById(userId, interestedUserId) {
  try {
    return await pg(
      true,
      `
                update interested_users set user_id = $1 where id = $2 and status = 'active' returning *;
            `,
      userId,
      interestedUserId
    );
  } catch (error) {
    throw Error(`interestedUsers repository [updateInterestedUserById]:${error}`);
  }
}

module.exports = {
  insertInterestedUser,
  getInterestedUserByUserId,
  getInterestedUserById,
  updateInterestedUserById
};
