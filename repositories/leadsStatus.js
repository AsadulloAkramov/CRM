const pg = require('../utils/pg');

async function insertLeadsStatus(name) {
  try {
    return await pg(
      true,
      `
        insert into leads_status(name) values($1) returning *;
    `,
      name
    );
  } catch (error) {
    throw Error(`leadsStatus repository [insertLeadsStatus]:${error}`);
  }
}

async function getStatusById(id) {
  try {
    return await pg(
      true,
      `
        select
            *
        from
            leads_status
        where id = $1 and status <> 'DELETED';
    `,
      id
    );
  } catch (error) {
    throw Error(`leadsStatus repository [getStatusById]:${error}`);
  }
}

async function getStatusByName(name) {
  try {
    return await pg(
      true,
      `
        select
            id
        from
            leads_status
        where name = $1 and status <> 'DELETED';
    `,
      name
    );
  } catch (error) {
    throw Error(`leadsStatus repository [getStatusByName]:${error}`);
  }
}

async function getLeadsStatuses(page, limit) {
  try {
    return await pg(
      false,
      `
        select
            *
        from
            leads_status
        where status <> 'DELETED'
        order by id desc
        offset ($1 - 1) * $2 fetch next $2 rows only;
    `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`leadsStatus repository [getLeadsStatuses]:${error}`);
  }
}

async function updateLeadsStatus(name, id, status) {
  try {
    return await pg(
      true,
      `
        update leads_status set name = $1, status = $2 where id = $3 returning *;
    `,
      name,
      status,
      id
    );
  } catch (error) {
    throw Error(`leadsStatus repository [updateLeadsStatus]:${error}`);
  }
}

async function deleteLeadsStatus(id) {
  try {
    return await pg(
      true,
      `
        update leads_status set status = $1 where id = $2 returning *;
      `,
      'DELETED',
      id
    );
  } catch (error) {
    throw Error(`leadsStatus repository [deleteLeadsStatus]:${error}`);
  }
}

module.exports = {
  insertLeadsStatus,
  getStatusById,
  getStatusByName,
  getLeadsStatuses,
  updateLeadsStatus,
  deleteLeadsStatus
};
