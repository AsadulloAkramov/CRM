const pg = require('../utils/pg');

async function insertStudentsStatus(name) {
  try {
    return await pg(
      true,
      `
        insert into students_status(name) values($1) returning *;
    `,
      name
    );
  } catch (error) {
    throw Error(`studentsStatus repository [insertStudentsStatus]:${error}`);
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
            students_status
        where id = $1 and status <> 'DELETED';
    `,
      id
    );
  } catch (error) {
    throw Error(`studentsStatus repository [getStatusById]:${error}`);
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
            students_status
        where name = $1 and status <> 'DELETED';
    `,
      name
    );
  } catch (error) {
    throw Error(`studentsStatus repository [getStatusByName]:${error}`);
  }
}

async function getStudentsStatuses(page, limit) {
  try {
    return await pg(
      false,
      `
        select
            *
        from
            students_status
        where status <> 'DELETED'
        order by id desc
        offset ($1 - 1) * $2 fetch next $2 rows only;
    `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`studentsStatus repository [getStudentsStatuses]:${error}`);
  }
}

async function updateStudentsStatus(name, id, status) {
  try {
    return await pg(
      true,
      `
        update students_status set name = $1, status = $2 where id = $3 returning *;
    `,
      name,
      status,
      id
    );
  } catch (error) {
    throw Error(`studentsStatus repository [updateStudentsStatus]:${error}`);
  }
}

async function deleteStudentsStatus(id) {
  try {
    return await pg(
      true,
      `
        update students_status set status = $1 where id = $2 returning *;
      `,
      'DELETED',
      id
    );
  } catch (error) {
    throw Error(`studentsStatus repository [deleteStudentsStatus]:${error}`);
  }
}

module.exports = {
  insertStudentsStatus,
  getStatusById,
  getStatusByName,
  getStudentsStatuses,
  updateStudentsStatus,
  deleteStudentsStatus
};
