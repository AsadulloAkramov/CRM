const pg = require('../utils/pg');

async function getContactHistory(page, limit) {
  try {
    let selectContactHistory = `
    SELECT *
    FROM contacts_history as ch where status = 'ACTIVE' and 1 = 1
    `;

    const offset = ' order by ch.id desc offset ($1 - 1) * $2 fetch next $2 rows only';

    selectContactHistory += offset;
    return await pg(false, selectContactHistory, page, limit);
  } catch (error) {
    throw Error(`contact history repository [getContactHistory]:${error}`);
  }
}

async function insertContactHistory(userId, via, direction, description, status) {
  try {
    const contactHistory = await pg(
      true,
      `
      insert into contacts_history(via, direction, comment, user_id, status) 
      values ($1, $2, $3, $4, $5) RETURNING *
      `,
      via,
      direction,
      description,
      userId,
      status
    );

    return contactHistory;
  } catch (error) {
    throw Error(`contactHistories repository [insertContactHistory]:${error}`);
  }
}

async function updateContactHistory(id, via, direction, description) {
  try {
    const updated = await pg(
      true,
      `
        update contacts_history set via = $1, direction = $2, comment = $3 where id = $4 returning *;
      `,
      via,
      direction,
      description,
      id
    );
    return updated;
  } catch (error) {
    throw Error(`contactHistories repository [updateContactHistory]:${error}`);
  }
}

async function deleteContactHistory(id) {
  try {
    const deleted = await pg(
      true,
      `
        update contacts_history set status = 'NOT_ACTIVE' where id = $1 returning *;
      `,
      id
    );
    return deleted;
  } catch (error) {
    throw Error(`contactHistories repository [deleteContactHistory]:${error}`);
  }
}

async function getContactHistoryByUserId(userId) {
  try {
    return await pg(
      true,
      `
    select 
      ch.id,
      ch.created_at,
      ch.via,
      ch.direction,
      ch.comment,
      ch.user_id,
      ch.status
    from contacts_history as ch
    where ch.user_id = $1
    `,
      userId
    );
  } catch (error) {
    throw Error(`contact history repository [getContactHistory]:${error}`);
  }
}

module.exports = {
  getContactHistory,
  insertContactHistory,
  updateContactHistory,
  deleteContactHistory,
  getContactHistoryByUserId
};
