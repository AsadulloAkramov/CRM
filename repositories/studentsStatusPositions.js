const pg = require('../utils/pg');

async function insertStudentsStatusPozitions(userId, statusId, isTrue) {
  try {
    if (isTrue) {
      return await pg(
        true,
        `
        insert into students_status_positions(user_id, position,status_id) 
        values($1,(select 
              position
            from
              students_status_positions
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
      insert into students_status_positions(user_id, position,status_id) 
      values($1,1,$2) returning *
    `,
      userId,
      statusId
    );
  } catch (error) {
    throw Error(`StudentsStatusePozitions repository [insertStudentsStatusPozitions]:${error}`);
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
          students_status_positions
        where id = $1;
    `,
      id
    );
  } catch (error) {
    throw Error(`StudentsStatusePozitions repository [getStatusPositionById]:${error}`);
  }
}

async function getStudentsStatusPozitions({ page, limit }) {
  try {
    return await pg(
      false,
      `
        select
            *
        from
            students_status_positions
        order by position asc
        offset ($1 - 1) * $2 limit $2;
    `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`StudentsStatusePozitions repository [getStudentsStatusPozitions]:${error}`);
  }
}

async function updateStudentsStatusPozitions(id, userId, statusId, position) {
  try {
    const where = ' where id = $1 returning *';

    const options = {
      status_id: ', status_id = $',
      position: ', position = $'
    };
    let generateQuery = `
        update 
          students_status_positions
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
    throw Error(`StudentsStatusePozitions repository [updateStudentsStatusPozitions]:${error}`);
  }
}

async function deleteStudentsStatusPozitions(id) {
  try {
    return await pg(
      true,
      `
        DELETE FROM students_status_positions WHERE id = $1 
        returning *;
    `,
      id
    );
  } catch (error) {
    throw Error(`StudentsStatusePozitions repository [deleteStudentsStatusPozitions]:${error}`);
  }
}

async function findStudentsPositionByUserId(id) {
  try {
    return await pg(
      true,
      `
        select user_id
        from students_status_positions
        where user_id = $1
    `,
      id
    );
  } catch (error) {
    throw Error(`StudentsStatusePozitions repository [findStudentsPositionByUserId]:${error}`);
  }
}

module.exports = {
  insertStudentsStatusPozitions,
  getStatusPositionById,
  getStudentsStatusPozitions,
  deleteStudentsStatusPozitions,
  updateStudentsStatusPozitions,
  findStudentsPositionByUserId
};
