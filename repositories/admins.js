const pg = require('../utils/pg');

const getAdminsByBranchId = async (branchId) => {
  const admins = await pg(
    false,
    `
      select id, user_id, branch_id, is_active from admins where branch_id = $1 and is_active = true;
    `,
    branchId
  );
  return admins;
};

const getAdmins = async () => {
  const admins = await pg(
    false,
    `
      select id, user_id, branch_id, is_active from admins where is_active = true;
    `
  );
  return admins;
};

async function getBranchById(branchId) {
  try {
    return await pg(true, 'select * from branches where id = $1 and is_active = true;', branchId);
  } catch (error) {
    throw Error(`Admin repository [getBranchById]:${error}`);
  }
}

async function getUserById(userId) {
  try {
    return await pg(true, 'select * from users where id = $1 and is_active = true;', userId);
  } catch (error) {
    throw Error(`Admin repository [getUserById]:${error}`);
  }
}

async function isAdmin(userId, branchId) {
  try {
    return await pg(
      true,
      'select * from admins where is_active = true and user_id = $1 and branch_id = $2;',
      userId,
      branchId
    );
  } catch (error) {
    throw Error(`Admin repository [isAdmin]:${error}`);
  }
}

async function insertAdmin(userId, branchId) {
  try {
    return await pg(
      true,
      `insert into admins(
      user_id,
      branch_id
    ) values(
      $1, $2
    ) returning *;`,
      userId,
      branchId
    );
  } catch (error) {
    throw Error(`Admin repository [insertAdmin]:${error}`);
  }
}

const findByUserId = async (userId) => {
  try {
    return await pg(
      true,
      `
    select * from admins where user_id = $1 and is_active = true order by id desc limit 1;`,
      userId
    );
  } catch (error) {
    throw Error(`Admin repository [findByUserId]:${error}`);
  }
};

const updateAdmin = async (userId, branchId) => {
  try {
    return await pg(
      true,
      `
    update admins set branch_id = $1 where user_id = $2 returning *`,
      branchId,
      userId
    );
  } catch (error) {
    throw Error(`Admin repository [updateAdmin]:${error}`);
  }
};

const getSuperAdmins = async () => {
  const admins = await pg(
    false,
    `
    select 
        p.*
    from permissions as p
    join roles as r on p.role_id = r.id
    join users as u on p.user_id = u.id
    where r.name = 'Super Admin' and u.is_active = true;
    `
  );
  return admins;
};

const findAdminById = async (id) => {
  const admin = await pg(
    true,
    `
    select * from admins where is_active = true and id = $1;
    `,
    id
  );
  return admin;
};

module.exports = {
  findByUserId,
  getBranchById,
  getUserById,
  isAdmin,
  insertAdmin,
  updateAdmin,
  getAdminsByBranchId,
  getAdmins,
  getSuperAdmins,
  findAdminById
};
