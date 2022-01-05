const pg = require('../utils/pg');

async function insertLeadsStatusPositions(userId, statusId, isTrue) {
  try {
    if (isTrue) {
      return await pg(
        true,
        `
        insert into leads_status_positions(user_id, position,status_id) 
        values($1,(select 
              position
            from
              leads_status_positions
            where user_id = $1
            order by position desc 
            limit 1) + 1 ,$2)
        returning *
      `,
        userId,
        statusId
      );
    }

    return await pg(
      true,
      `
      insert into leads_status_positions(user_id, position,status_id) 
      values($1,1,$2) returning id,user_id,status_id,position
    `,
      userId,
      statusId
    );
  } catch (error) {
    throw Error(`LeadStatusePositions repository [insertLeadsStatusPositions]:${error}`);
  }
}

async function getStatusPositionById(id) {
  try {
    return await pg(
      true,
      `
        select
            id
        from
          leads_status_positions
        where id = $1;
    `,
      id
    );
  } catch (error) {
    throw Error(`LeadStatusePositions repository [getStatusPositionById]:${error}`);
  }
}

async function getLeadStatusPositions({ page, limit }) {
  try {
    return await pg(
      false,
      `
        select
            id,status_id,position,user_id
        from
            leads_status_positions
        order by position asc
        offset ($1 - 1) * $2 limit $2;
    `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`LeadStatusePositions repository [getLeadStatusePositions]:${error}`);
  }
}

async function updateLeadsStatusPositions(id, userId, statusId, position) {
  try {
    const where = ' where id = $1 returning id, user_id, status_id, position';

    const options = {
      status_id: ', status_id = $',
      position: ', position = $'
    };
    let generateQuery = `
        update 
          leads_status_positions
        set
          user_id = $2
        
        `;
    const values = [id, userId];
    let counter = 3;
    if (statusId) {
      values.push(statusId);
      generateQuery += options.status_id + counter;
      counter += 1;
    }

    if (position) {
      values.push(position);
      generateQuery += options.position + counter;
      counter += 1;
    }

    generateQuery += where;
    return await pg(true, generateQuery, ...values);
  } catch (error) {
    throw Error(`leadsStatusPositions repository [updateLeadsStatusPositions]:${error}`);
  }
}

async function deleteLeadsStatusPositions(id) {
  try {
    return await pg(
      true,
      `
        DELETE FROM leads_status_positions WHERE id = $1 
        returning 
          id,
          user_id,
          status_id,
          position;
    `,
      id
    );
  } catch (error) {
    throw Error(`leadsStatusPositions repository [deleteLeadsStatusPositions]:${error}`);
  }
}

async function findLeadsPositionByUserId(id) {
  try {
    return await pg(
      true,
      `
        select user_id
        from leads_status_positions
        where user_id = $1
    `,
      id
    );
  } catch (error) {
    throw Error(`leadsStatusPositions repository [findLeadsPositionByUserId]:${error}`);
  }
}

module.exports = {
  insertLeadsStatusPositions,
  getStatusPositionById,
  getLeadStatusPositions,
  deleteLeadsStatusPositions,
  updateLeadsStatusPositions,
  findLeadsPositionByUserId
};
