const pg = require('../utils/pg');

async function insertLeadsComePlace(name) {
  try {
    return await pg(
      true,
      `
        insert into leads_come_place(name) values($1) returning *;
    `,
      name
    );
  } catch (error) {
    throw Error(`leadsComePlace repository [insertLeadsComePlace]:${error}`);
  }
}

async function getPlaceById(id) {
  try {
    return await pg(
      true,
      `
        select
            *
        from
            leads_come_place
        where id = $1 and status <> 'DELETED';
    `,
      id
    );
  } catch (error) {
    throw Error(`leadsComePlace repository [getPlaceById]:${error}`);
  }
}

async function getPlaceByName(name) {
  try {
    return await pg(
      true,
      `
        select
            id
        from
            leads_come_place
        where name = $1 and status <> 'DELETED';
    `,
      name
    );
  } catch (error) {
    throw Error(`leadsComePlace repository [getPlaceByName]:${error}`);
  }
}

async function getLeadsComePlaces(page, limit) {
  try {
    return await pg(
      false,
      `
        select
            *
        from
            leads_come_place
        where status <> 'DELETED'
        order by id desc
        offset ($1 - 1) * $2 fetch next $2 rows only;
    `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`leadsComePlace repository [getLeadsComePlaces]:${error}`);
  }
}

async function updateLeadsComePlace(name, id, status) {
  try {
    return await pg(
      true,
      `
        update leads_come_place set name = $1, status = $2 where id = $3 returning *;
      `,
      name,
      status,
      id
    );
  } catch (error) {
    throw Error(`leadsComePlace repository [updateLeadsComePlace]:${error}`);
  }
}

async function deleteLeadsComePlace(id) {
  try {
    return await pg(
      true,
      `
        update leads_come_place set status = $1 where id = $2 returning *;
      `,
      'DELETED',
      id
    );
  } catch (error) {
    throw Error(`leadsComePlace repository [deleteLeadsComePlace]:${error}`);
  }
}

module.exports = {
  insertLeadsComePlace,
  getPlaceByName,
  getLeadsComePlaces,
  updateLeadsComePlace,
  getPlaceById,
  deleteLeadsComePlace
};
