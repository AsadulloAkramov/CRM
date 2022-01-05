const pg = require('../utils/pg');

async function getDistricts() {
  try {
    return await pg(
      false,
      `
        select * from districts where is_active = true order by id desc;
      `
    );
  } catch (error) {
    throw Error(`district repository [getDistrict]:${error}`);
  }
}

async function insertDistrict(name, regionId) {
  try {
    return await pg(
      true,
      `
        insert into districts(name,region_id) values($1,$2) returning *;
      `,
      name,
      regionId
    );
  } catch (error) {
    throw Error(`district repository [insertDistrict]:${error}`);
  }
}

async function updateDistrict(name, id, regionId) {
  try {
    return await pg(
      true,
      `
        update districts set name = $1,region_id=$3 where id = $2 returning *;
      `,
      name,
      id,
      regionId
    );
  } catch (error) {
    throw Error(`district repository [updateDistrict]:${error}`);
  }
}

async function deleteDistrict(id) {
  try {
    return await pg(
      true,
      `
        update districts set is_active = false where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`district repository [deleteDistrict]:${error}`);
  }
}

async function getDistrictById(id) {
  try {
    return await pg(
      true,
      `
        select id, created_at, name, is_active from districts where id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`district repository [getDistrictById]:${error}`);
  }
}

async function getDistrictByName(name) {
  try {
    return await pg(
      true,
      `
        select id from districts where name = $1 and is_active = true;
      `,
      name
    );
  } catch (error) {
    throw Error(`district repository [getDistrictByName]:${error}`);
  }
}

async function getDistrictsByRegionId(id) {
  try {
    return await pg(
      false,
      `
        select id,  created_at, name, region_id, is_active from districts where region_id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`district repository [getDistrictsByRegionId]:${error}`);
  }
}

const findByRegionId = async (regionId) => {
  const query = `
    select * from districts where is_active = true and region_id = $1;
  `;

  const districts = await pg(false, query, regionId);

  return districts;
};

module.exports = {
  getDistricts,
  insertDistrict,
  updateDistrict,
  deleteDistrict,
  getDistrictById,
  getDistrictByName,
  getDistrictsByRegionId,
  findByRegionId
};
