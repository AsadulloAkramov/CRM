const pg = require('../utils/pg');

async function getBranches() {
  try {
    return await pg(false, 'select * from branches where is_active = true order by id desc;');
  } catch (error) {
    throw Error(`Branches repository [getBranches]:${error}`);
  }
}

async function getBranchesByRegionId(regionId) {
  try {
    return await pg(
      false,
      'select * from branches where is_active = true and region_id = $1 order by id desc;',
      regionId
    );
  } catch (error) {
    throw Error(`Branches repository [getBranchesByRegionId]:${error}`);
  }
}

async function insertBranch(name, size, regionId) {
  try {
    return await pg(
      true,
      'insert into branches(name, size, region_id) values($1, $2, $3) returning *;',
      name,
      size,
      regionId
    );
  } catch (error) {
    throw Error(`Branches repository [insertBranch]:${error}`);
  }
}

async function getBranchByName(name) {
  try {
    return await pg(true, 'select id from branches where name = $1 and is_active = true;', name);
  } catch (error) {
    throw Error(`Branches repository [getBranchByName]:${error}`);
  }
}

async function getRegionById(regionId) {
  try {
    return await pg(true, 'select * from regions where id = $1 and is_active = true;', regionId);
  } catch (error) {
    throw Error(`Branches repository [getRegionById]:${error}`);
  }
}

async function updateBranch(name, size, regionId, id) {
  try {
    return await pg(
      true,
      'update branches set name = $1, size = $2, region_id = $3 where id = $4 returning *;',
      name,
      size,
      regionId,
      id
    );
  } catch (error) {
    throw Error(`Branches repository [updateBranch]:${error}`);
  }
}

async function getBranchById(id) {
  try {
    return await pg(true, 'select * from branches where id = $1 and is_active = true;', id);
  } catch (error) {
    throw Error(`Branches repository [getBranchById]:${error}`);
  }
}

async function deleteBranch(userId) {
  try {
    return await pg(
      true,
      'update branches set is_active = false where id = $1 and is_active = true returning *;',
      userId
    );
  } catch (error) {
    throw Error(`Branches repository [deleteBranch]:${error}`);
  }
}
async function getGroupsCount(id) {
  try {
    return await pg(
      true,
      `select 
        count(room_id) 
       from 
        branches
       join rooms on rooms.branch_id = branches.id
       join groups g on g.room_id = rooms.id
       where 
        branches.id = $1`,
      id
    );
  } catch (error) {
    throw Error(`Branches repository [getGroupCount]:${error}`);
  }
}

async function getStudentsCount(id) {
  try {
    return await pg(
      true,
      `select 
        count(room_id) 
       from 
        branches
       join rooms on rooms.branch_id = branches.id
       join groups g on g.room_id = rooms.id
       join students s on s.group_id = g.id
       where 
         branches.id = $1
      `,
      id
    );
  } catch (error) {
    throw Error(`Branches repository [getGroupCount]:${error}`);
  }
}

module.exports = {
  getBranches,
  getBranchesByRegionId,
  insertBranch,
  getBranchByName,
  getRegionById,
  updateBranch,
  getBranchById,
  deleteBranch,
  getGroupsCount,
  getStudentsCount
};
