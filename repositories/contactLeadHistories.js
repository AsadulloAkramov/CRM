const pg = require('../utils/pg');

async function getContactLeadHistories(leadId, page, limit) {
  try {
    return await pg(
      false,
      `SELECT *
      FROM contact_lead_history
      WHERE is_active = true and lead_id = $1
      ORDER BY id desc
      OFFSET ($2 - 1) * $3 fetch next $3 rows only;`,
      leadId,
      page,
      limit
    );
  } catch (error) {
    throw Error(`contactLeadHistories repository [getContactLeadHistories]:${error}`);
  }
}

async function getContactLeadHistoryById(id) {
  try {
    return await pg(
      false,
      `
          SELECT * FROM contact_lead_history WHERE id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`contactLeadHistories repository [getContactLeadHistoriesById]:${error}`);
  }
}

async function getLastContactHistoryByLeadId(leadId) {
  try {
    return await pg(
      true,
      `
          SELECT
            clh.id,
            clh.created_at,
            clh.lead_id,
            clh.via,
            clh.direction,
            clh.comment,
            clh.is_active,
            clh.assignee_admin_id
          FROM contact_lead_history as clh
          JOIN leads as l on l.id = clh.lead_id
          WHERE l.id = $1 AND clh.is_active = true
          ORDER BY clh.id desc
      `,
      leadId
    );
  } catch (error) {
    throw Error(`contactLeadHistories repository [getContactLeadHistoriesById]:${error}`);
  }
}

async function insertContactLeadHistory(leadId, via, direction, comment, assigneeId) {
  try {
    return await pg(
      true,
      `
        INSERT INTO contact_lead_history (lead_id, via, direction, comment, assignee_admin_id) VALUES ($1, $2, $3, $4, $5) returning *;
    `,
      leadId,
      via,
      direction,
      comment,
      assigneeId
    );
  } catch (error) {
    throw Error(`contactLeadHistories repository [insertContactLeadHistory]:${error}`);
  }
}

async function updateContactLeadHistories(args) {
  try {
    const argsLength = Object.keys(args).length;
    const updateFields = {
      via: ` via = '${args.via}'`,
      direction: ` direction = '${args.direction}'`,
      comment: ` comment = '${args.comment}'`
    };
    let Query = 'update contact_lead_history set';
    const whereQuery = ` where id = ${args.id} returning *;`;

    let updateQuery = '';
    Object.keys(updateFields).forEach((key, index) => {
      if (args[key]) {
        if (argsLength > 2 && index !== argsLength - 1) {
          updateQuery += `${updateFields[key]},`;
        } else {
          updateQuery += `${updateFields[key]}`;
        }
      }
    });
    Query += updateQuery;
    Query += whereQuery;
    return await pg(true, Query);
  } catch (error) {
    throw Error(`contactLeadHistories repository [updateContactLeadHistories]:${error}`);
  }
}

async function deleteContactLeadHistory(id) {
  try {
    return await pg(true, 'UPDATE contact_lead_history SET is_active = false WHERE id = $1', id);
  } catch (error) {
    throw Error(`contactLeadHistories repository [deleteContactLeadHistory]:${error}`);
  }
}

module.exports = {
  getContactLeadHistories,
  getContactLeadHistoryById,
  insertContactLeadHistory,
  updateContactLeadHistories,
  deleteContactLeadHistory,
  getLastContactHistoryByLeadId
};
