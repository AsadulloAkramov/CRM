const pg = require('../utils/pg');

async function getRegions() {
  try {
    return await pg(
      false,
      `
        select
          *
        from
          regions
        where is_active = true
        order by case
        when name = 'Toshkent shahri' then 0
        when name = 'Toshkent viloyati' then 1
        else 3 end;
      `
    );
  } catch (error) {
    throw Error(`region repository [getRegions]:${error}`);
  }
}

async function insertRegion(name) {
  try {
    return await pg(
      true,
      `
        insert into regions(name) values($1) returning *;
      `,
      name
    );
  } catch (error) {
    throw Error(`region repository [insertRegion]:${error}`);
  }
}

async function updateRegion(name, id) {
  try {
    return await pg(
      true,
      `
        update regions set name = $1 where id = $2 returning *;
      `,
      name,
      id
    );
  } catch (error) {
    throw Error(`region repository [updateRegion]:${error}`);
  }
}

async function deleteRegion(id) {
  try {
    return await pg(
      true,
      `
        update regions set is_active = false where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`region repository [deleteRegion]:${error}`);
  }
}

async function getRegionById(id) {
  try {
    return await pg(
      true,
      `
        select id,name,created_at,is_active from regions where id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`region repository [name]:${error}`);
  }
}
async function getRegionByName(name) {
  try {
    return await pg(
      true,
      `
        select id from regions where name = $1 and is_active = true;
      `,
      name
    );
  } catch (error) {
    throw Error(`region repository [getRegionByName]:${error}`);
  }
}

module.exports = {
  getRegions,
  insertRegion,
  updateRegion,
  deleteRegion,
  getRegionById,
  getRegionByName
};
