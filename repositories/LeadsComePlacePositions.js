const pg = require('../utils/pg');

async function insertLeadsComePlace(userId, comePlaceId, isTrue) {
  try {
    if (isTrue) {
      return await pg(
        true,
        `
        insert into leads_come_place_positions(user_id, position,come_place_id) 
        values($1,(select 
              position
            from
              leads_come_place_positions
            where user_id = $1
            order by position desc 
            limit 1) + 1 ,$2)
        returning *
      `,
        userId,
        comePlaceId
      );
    }

    return await pg(
      true,
      `
      insert into leads_come_place_positions(user_id, position,come_place_id) 
      values($1,1,$2) returning id,user_id,come_place_id,position
    `,
      userId,
      comePlaceId
    );
  } catch (error) {
    throw Error(`LeadsComePlacePosition repository [insertLeadsComePlacePosition]:${error}`);
  }
}

async function getComePlacePositionById(id) {
  try {
    return await pg(
      true,
      `
        select
            id
        from
          leads_come_place_positions
        where id = $1;
    `,
      id
    );
  } catch (error) {
    throw Error(`ComePlacePositions repository [getComePlacePositionById]:${error}`);
  }
}

async function getLeadsComePlacePositions({ page, limit }) {
  try {
    return await pg(
      false,
      `
        select
            id,come_place_id,position,user_id
        from
          leads_come_place_positions
        order by position asc
        offset ($1 - 1) * $2 limit $2;
    `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`LeadComePlacePositions repository [getLeadsComePlacePositions]:${error}`);
  }
}

async function updateLeadsComePlace(id, userId, comePlaceId, position) {
  try {
    const where = ' where id = $1 returning id, user_id, come_place_id, position';

    const options = {
      come_place_id: ', come_place_id = $',
      position: ', position = $'
    };
    let generateQuery = `
        update 
          leads_come_place_positions
        set
          user_id = $2
        
        `;
    const values = [id, userId];
    let counter = 3;
    if (comePlaceId) {
      values.push(comePlaceId);
      generateQuery += options.come_place_id + counter;
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
    throw Error(`LeadsComePlacePositions repository [updateLeadsComePlacePosition]:${error}`);
  }
}

async function deleteLeadsComePlace(id) {
  try {
    return await pg(
      true,
      `
        DELETE FROM leads_come_place_positions WHERE id = $1 
        returning 
          id,
          user_id,
          come_place_id,
          position;
    `,
      id
    );
  } catch (error) {
    throw Error(
      `leadsdeleteLeadsComePlacePositions repository [deleteLeadsComePlacePositions]:${error}`
    );
  }
}

async function findComePlaceByUserId(id) {
  try {
    return await pg(
      true,
      `
        select user_id
        from leads_come_place_positions
        where user_id = $1
    `,
      id
    );
  } catch (error) {
    throw Error(`leadsComePlacePositions repository [findComePlaceByUserId]:${error}`);
  }
}

module.exports = {
  insertLeadsComePlace,
  getComePlacePositionById,
  getLeadsComePlacePositions,
  deleteLeadsComePlace,
  updateLeadsComePlace,
  findComePlaceByUserId
};
