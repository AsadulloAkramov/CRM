const pg = require('../utils/pg');

async function getPermissions() {
  try {
    return await pg(
      false,
      `
        select * from permissions order by id desc;
      `
    );
  } catch (error) {
    throw Error(`permissions repository [getPermissions]:${error}`);
  }
}

async function getPermissionsByUserId(userId) {
  try {
    return await pg(
      false,
      `
        select * from permissions where user_id = $1 order by id desc;
      `,
      userId
    );
  } catch (error) {
    throw Error(`permissions repository [getPermissionsByUserId]:${error}`);
  }
}
async function getRoleById(roleId) {
  try {
    return await pg(
      true,
      `
        select * from roles where id = $1 and is_active = true;
      `,
      roleId
    );
  } catch (error) {
    throw Error(`permissions repository [getRoleById]:${error}`);
  }
}
async function getUserById(userId) {
  try {
    return await pg(
      true,
      `
        select * from users where id = $1 and is_active = true;
      `,
      userId
    );
  } catch (error) {
    throw Error(`permissions repository [getUserById]:${error}`);
  }
}
async function checkUserPermission(userId, roleId) {
  try {
    return await pg(
      true,
      `
        select * from permissions where user_id = $1 and role_id = $2;
      `,
      userId,
      roleId
    );
  } catch (error) {
    throw Error(`permissions repository [checkUserPermission]:${error}`);
  }
}
async function insertPermission(userId, roleId) {
  try {
    return await pg(
      true,
      `
        insert into permissions(
          user_id,
          role_id
        ) values(
          $1, $2
        ) returning *;
      `,
      userId,
      roleId
    );
  } catch (error) {
    throw Error(`permissions repository [insertPermission]:${error}`);
  }
}
async function getPermissionById(id) {
  try {
    return await pg(
      true,
      `
        select * from permissions where id = $1;
      `,
      id
    );
  } catch (error) {
    throw Error(`permissions repository [getPermissionById]:${error}`);
  }
}

async function deletePermission(id) {
  try {
    return await pg(
      true,
      `
        delete from permissions where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`permissions repository [deletePermission]:${error}`);
  }
}
async function deletePermissionForAdmin(userId, id) {
  try {
    return await pg(
      true,
      `
        with delete_from_admins as (
          update admins set is_active = false where user_id = $1
        ) delete from permissions where id = $2 returning *;
      `,
      userId,
      id
    );
  } catch (error) {
    throw Error(`permissions repository [deletePermissionForAdmin]:${error}`);
  }
}

const addPermission = async (userId, roleId) => {
  try {
    const checkPermission = 'select * from permissions where user_id = $1 and role_id = $2';

    if (await pg(true, checkPermission, userId, roleId)) {
      return null;
    }

    // prettier-ignore
    const addPermissionQuery = 'insert into permissions(user_id, role_id) values($1, $2) returning *;';

    return await pg(true, addPermissionQuery, userId, roleId);
  } catch (error) {
    throw Error(`permissions repository [addPermission]:${error}`);
  }
};

module.exports = {
  addPermission,
  getPermissions,
  getPermissionsByUserId,
  getRoleById,
  getUserById,
  checkUserPermission,
  insertPermission,
  getPermissionById,
  deletePermission,
  deletePermissionForAdmin
};
