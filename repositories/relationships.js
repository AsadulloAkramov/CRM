const pg = require('../utils/pg');

async function getRelationships() {
  try {
    return await pg(
      false,
      `
        select * from relationships order by id desc;
      `
    );
  } catch (error) {
    throw Error(`relationships repository [getRelationships]:${error}`);
  }
}

async function insertRelationship(name) {
  try {
    return await pg(
      true,
      `
        insert into relationships(name) values($1) returning *;
      `,
      name
    );
  } catch (error) {
    throw Error(`relationships repository [insertRelationship]:${error}`);
  }
}

async function updateRelationship(name, id) {
  try {
    return await pg(
      true,
      `
        update relationships set name = $1 where id = $2 returning *;
      `,
      name,
      id
    );
  } catch (error) {
    throw Error(`relationships repository [updateRelationship]:${error}`);
  }
}

async function deleteRelationship(id) {
  try {
    return await pg(
      true,
      `
        delete from relationships where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`relationships repository [deleteRelationship]:${error}`);
  }
}

async function getRelationshipById(id) {
  try {
    return await pg(
      true,
      `
        select * from relationships where id = $1;
      `,
      id
    );
  } catch (error) {
    throw Error(`relationship repository [getRelationshiById]:${error}`);
  }
}
async function getRelationshipByName(name) {
  try {
    return await pg(
      true,
      `
        select * from relationships where name = $1;
      `,
      name
    );
  } catch (error) {
    throw Error(`relationships repository [getRelationshipByName]:${error}`);
  }
}

module.exports = {
  getRelationships,
  insertRelationship,
  updateRelationship,
  deleteRelationship,
  getRelationshipById,
  getRelationshipByName
};
