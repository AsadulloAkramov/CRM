const { ROLES } = require('../config');
const pg = require('../utils/pg');

const setAvatar = async (fileName, userId) => {
  const query = 'update users set avatar = $1 where id = $2 returning *;';

  const data = await pg(true, query, fileName, userId);

  return data;
};

async function getUsers(page, limit) {
  try {
    const query = `
      select
        id,
        created_at,
        first_name,
        last_name,
        region_id,
        telegram_id,
        phone_number,
        telegram_step,
        is_active,
        avatar,
        to_char(bornt_date, 'YYYY-MM-DD') as bornt_date
      from
        users
      where is_active = true order by id desc offset ($1 - 1) * $2 fetch next $2 rows only;
    `;

    const data = await pg(false, query, page, limit);

    return data;
  } catch (error) {
    throw Error(`Users repository [getUsers]:${error}`);
  }
}

async function getRolesByUserId(id) {
  try {
    const query = `
      select r.id, r.name, r.is_active from permissions as p join roles as r on r.id = p.role_id  where p.user_id = $1 and r.is_active = true;
    `;

    const data = await pg(false, query, id);

    return data;
  } catch (error) {
    throw Error(`Users repository [getRolesByUserId]:${error}`);
  }
}

async function getUserByPhoneNumber(phoneNumber) {
  try {
    const query = `
      select * from users where is_active = true and phone_number = $1;
    `;

    const data = await pg(true, query, phoneNumber);

    return data;
  } catch (error) {
    throw Error(`Users repository [getUserByPhoneNumber]:${error}`);
  }
}

async function insertUser(firstName, lastName, borntDate, regionId, districtId, phoneNumber) {
  try {
    return await pg(
      true,
      `
        insert into users(
          first_name,
          last_name,
          bornt_date,
          region_id,
          district_id,
          phone_number
        ) values(
          $1, $2, $3, $4, $5, $6
        ) returning *;
      `,
      firstName,
      lastName,
      borntDate,
      regionId,
      districtId,
      phoneNumber
    );
  } catch (error) {
    throw Error(`Users repository [insertUser]:${error}`);
  }
}

async function updateUser(firstName, lastName, phoneNumber, regionId, borntDate, districtId, id) {
  try {
    return await pg(
      true,
      `
        update users set first_name = $1, last_name = $2, phone_number = $3, region_id = $4, bornt_date = $5, district_id = $6 where id = $7 and is_active = true returning *;
      `,
      firstName,
      lastName,
      phoneNumber,
      regionId,
      borntDate,
      districtId,
      id
    );
  } catch (error) {
    throw Error(`Users repository [updateUser]:${error}`);
  }
}

async function createDeposit(userId) {
  try {
    return await pg(
      true,
      `
        insert into deposits(user_id) values($1);
      `,
      userId
    );
  } catch (error) {
    throw Error(`Users repository [createDeposit]:${error}`);
  }
}

async function getRegionById(id) {
  try {
    return await pg(
      true,
      `
        select * from regions where id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`Users repository [getRegionById]:${error}`);
  }
}

async function getUsersByPattern(pattern) {
  try {
    return await pg(
      false,
      `
        select
          id,
          created_at,
          first_name,
          last_name,
          region_id,
          telegram_id,
          phone_number,
          telegram_step,
          avatar,
          is_active,
          to_char(bornt_date, 'YYYY-MM-DD') as bornt_date
        from
          users
        where
          is_active = true
          and lower(first_name) like '%' || lower($1) || '%'
          or lower(last_name) like '%' || lower($1) || '%'
          or phone_number like '%' || $1 || '%'
          or telegram_id::varchar like '%' || $1 || '%'
          or lower(first_name || ' ' || last_name) like '%'|| lower($1) ||'%';
      `,
      pattern
    );
  } catch (error) {
    throw Error(`Users repository [getUsersByPattern]:${error}`);
  }
}

async function getUserById(userId) {
  try {
    const query = `
      select * from users where id = $1 and is_active = true;
    `;
    return await pg(true, query, userId);
  } catch (error) {
    throw Error(`Users repository [getUserById]:${error}`);
  }
}

const findUserById = async (id) => {
  try {
    const query = `
      select * from users where id = $1;
    `;
    return await pg(true, query, id);
  } catch (error) {
    throw new Error(`[UsersRepository]:[findUserById]:${error}`);
  }
};

const findUserByStudentId = async (StudetnId) => {
  try {
    const query = `
      SELECT
        u.id,
        u.telegram_id,
        u.is_active
      FROM users as u
      JOIN students as s on s.user_id = u.id
      WHERE
        s.id = $1
      and
        u.is_active = true;
    `;
    return await pg(true, query, StudetnId);
  } catch (error) {
    throw new Error(`[UsersRepository]:[findUserByStudentId]:${error}`);
  }
};

async function findUsersById(ids) {
  try {
    return await pg(
      false,
      `
        select * from users where id = ANY(ARRAY[${ids}]) and is_active = true;
    `
    );
  } catch (error) {
    throw Error(`users repository [findUsersById]:${error}`);
  }
}

async function isSuperAdmin(userId) {
  const query = `
    select * from permissions where user_id = $1 and role_id = (
      select id from roles where name = '${ROLES.superAdmin}' and is_active = true
    );
  `;

  const data = await pg(true, query, userId);

  return !!data;
}

async function deleteUserByIds(ids) {
  try {
    return await pg(
      false,
      `
      update users set is_active = false where id = ANY(ARRAY[${ids}]) returning *;
    `
    );
  } catch (error) {
    throw Error(`leads repository [deleteUserByIds]:${error}`);
  }
}

async function deleteUser(id) {
  try{
     return await pg(true ,
      `
      delete from users 
      where id=${id}
      returning *
      `
    );

  } catch(error) {
    throw Error(`users repository [deleteUser]:${error}`);
  }
}

async function getAvatar(id) {
  try {
    return await pg(
      true,
      `
      select avatar
       from users
       where id = $1
    `,
      id
    );
  } catch (error) {
    throw Error(`Users repository [getAvatar]:${error}`);
  }
}

async function updateAvatar(avatar, userId) {
  try {
    return await pg(
      true,
      `
      update users set avatar = $1 where id = $2 returning *;
    `,
      avatar,
      userId
    );
  } catch (error) {
    throw Error(`Users repository [updateAvatar]:${error}`);
  }
}

async function deleteAvatar(userId) {
  try {
    return await pg(
      true,
      `
      update users set avatar = null where id = $1 returning *;
    `,
      userId
    );
  } catch (error) {
    throw Error(`Users repository [deleteAvatar]:${error}`);
  }
}

async function findAdditionalContactByUserId(id) {
  try {
    return await pg(
      false,
      `
      select * from additional_contacts where user_id = $1;     
    `,
      id
    );
  } catch (error) {
    throw Error(`user repository [findAdditionalContactByUserId]:${error}`);
  }
}

module.exports = {
  setAvatar,
  findUserById,
  getUserById,
  getUsers,
  getRegionById,
  getUsersByPattern,
  getRolesByUserId,
  getUserByPhoneNumber,
  insertUser,
  updateUser,
  createDeposit,
  findUserByStudentId,
  findUsersById,
  isSuperAdmin,
  deleteUserByIds,
  deleteUser,
  getAvatar,
  updateAvatar,
  deleteAvatar,
  findAdditionalContactByUserId
};
