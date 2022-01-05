const pg = require('../utils/pg');

async function getRoles(page, limit) {
  try {
    return await pg(
      false,
      `
        select * from roles where is_active = true order by id desc offset ($1 - 1) * $2 fetch next $2 rows only;
      `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`roles repository [getRoles]: ${error}`);
  }
}

async function getRoleByName(name) {
  try {
    return await pg(
      true,
      `
        select * from roles where name = $1 and is_active = true;
      `,
      name
    );
  } catch (error) {
    throw Error(`roles repository [getRoleByName]: ${error}`);
  }
}
async function getRoleById(id) {
  try {
    return await pg(
      true,
      `
        select * from roles where id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`roles repository [getRoleById]: ${error}`);
  }
}

async function insertRole(name) {
  try {
    return await pg(
      true,
      `
    insert into roles(
      name
    ) values(
      $1
    ) returning *;
  `,
      name
    );
  } catch (error) {
    throw Error(`roles repository [insertRole]: ${error}`);
  }
}
async function updateRole(name, id) {
  try {
    return await pg(
      true,
      `
        update roles set name = $1 where id = $2 returning *;
      `,
      name,
      id
    );
  } catch (error) {
    throw Error(`roles repository [updateRole]: ${error}`);
  }
}
async function deleteRole(id) {
  try {
    return await pg(
      true,
      `
        with delete_role_permissions as (
          delete from permissions where role_id = $1
        ), delete_role_access as (
          delete from role_access where role_id = $1
        ) update roles set is_active = false where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`roles repository [deleteRole]: ${error}`);
  }
}
async function getModuleById(moduleId) {
  try {
    return await pg(
      true,
      `
        select * from modules where id = $1 and is_active = true;
      `,
      moduleId
    );
  } catch (error) {
    throw Error(`roles repository [getModuleById]: ${error}`);
  }
}
async function checkRoleAccess(roleId, moduleId) {
  try {
    return await pg(
      true,
      `
        select * from role_access where role_id = $1 and module_id = $2;
      `,
      roleId,
      moduleId
    );
  } catch (error) {
    throw Error(`roles repository [checkRoleAccess]: ${error}`);
  }
}
async function insertRoleAccess(
  roleId,
  moduleId,
  roleAccessRead,
  roleAccessInsert,
  roleAccessUpdate,
  roleAccessDelete
) {
  try {
    return await pg(
      true,
      `
        insert into role_access(
          role_id,
          module_id,
          read,
          insert,
          update,
          delete
        ) values(
          $1, $2, $3, $4, $5, $6
        ) returning *;
      `,
      roleId,
      moduleId,
      roleAccessRead,
      roleAccessInsert,
      roleAccessUpdate,
      roleAccessDelete
    );
  } catch (error) {
    throw Error(`roles repository [insertRoleAccess]: ${error}`);
  }
}
async function getRoleAccessByRoleId(roleId) {
  try {
    return await pg(
      false,
      `
        select * from role_access where role_id = $1;
      `,
      roleId
    );
  } catch (error) {
    throw Error(`roles repository [name]: ${error}`);
  }
}

async function getRoleAccessById(roleAccessId) {
  try {
    return await pg(
      true,
      `
        select * from role_access where id = $1;
      `,
      roleAccessId
    );
  } catch (error) {
    throw Error(`roles repository [name]: ${error}`);
  }
}

async function updateRoleAccess(method, access, id) {
  try {
    return await pg(
      true,
      `
        update role_access set ${method} = ${access} where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`roles repository [name]: ${error}`);
  }
}

async function deleteRoleAccess(id) {
  try {
    return pg(
      true,
      `
        delete from role_access where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`roles repository [deleteRoleAccess]: ${error}`);
  }
}

async function getRolesByPattern(pattern) {
  try {
    return await pg(
      false,
      `
        select * from roles where is_active = true and lower(name) like '%' || lower($1) || '%';
      `,
      pattern
    );
  } catch (error) {
    throw Error(`roles repository [getRolesByPattern]: ${error}`);
  }
}

const getRoleIdByName = async (roleName) => {
  try {
    // prettier-ignore
    const query = 'select * from roles where name = $1 and is_active = true order by id desc limit 1';

    return await pg(true, query, roleName);
  } catch (error) {
    throw Error(`roles repository [getRoleIdByName]: ${error}`);
  }
};

module.exports = {
  getRoleIdByName,
  getRoles,
  getRoleByName,
  getRoleById,
  insertRole,
  updateRole,
  deleteRole,
  getModuleById,
  checkRoleAccess,
  insertRoleAccess,
  getRoleAccessByRoleId,
  getRoleAccessById,
  updateRoleAccess,
  deleteRoleAccess,
  getRolesByPattern
};
