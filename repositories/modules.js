const pg = require('../utils/pg');

async function getModuleByName(name) {
  try {
    return await pg(
      true,
      `
        select * from modules where name = $1 and is_active = true
      `,
      name
    );
  } catch (error) {
    throw Error(`modules repository [getModuleByName]:${error}`);
  }
}

async function getModuleById(id) {
  try {
    return await pg(
      true,
      `
        select * from modules where id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`modules repository [getModuleById]:${error}`);
  }
}

async function insertModule(name) {
  try {
    return await pg(
      true,
      `
        insert into modules(name) values($1) returning *;
      `,
      name
    );
  } catch (error) {
    throw Error(`modules repository [insertModule]:${error}`);
  }
}

async function updateModule(name, id) {
  try {
    return await pg(
      true,
      `
        update modules set name = $1 where id = $2 returning *;
      `,
      name,
      id
    );
  } catch (error) {
    throw Error(`modules repository [updateModule]:${error}`);
  }
}

async function deleteModule(id) {
  try {
    return await pg(
      true,
      `
        update modules set is_active = false where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`modules repository [deleteModule]:${error}`);
  }
}

async function getModulesByRoleId(roleId) {
  try {
    return await pg(
      false,
      `
        select * from modules where is_active = true and id <> all(select module_id from role_access where role_id = $1);
      `,
      roleId
    );
  } catch (error) {
    throw Error(`modules repository [getModulesByRoleId]:${error}`);
  }
}

async function getModulesByRoleIdAndPattern(roleId, pattern) {
  try {
    return await pg(
      false,
      `
        select * from modules where is_active = true and id <> all(select module_id from role_access where role_id = $1) and name like '%' || $2 || '%';
      `,
      roleId,
      pattern
    );
  } catch (error) {
    throw Error(`modules repository [getModulesByRoleIdAndPattern]:${error}`);
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
    throw Error(`modules repository [getRoleById]:${error}`);
  }
}

module.exports = {
  getModuleById,
  getModuleByName,
  insertModule,
  updateModule,
  deleteModule,
  getModulesByRoleId,
  getModulesByRoleIdAndPattern,
  getRoleById
};
