const pg = require('../utils/pg');

async function createSale(name, count, comment) {
  try {
    return await pg(
      true,
      `
      insert into sales(name,count,comment) values($1,$2,$3) returning *;
    `,
      name,
      count,
      comment
    );
  } catch (error) {
    throw Error(`sales modules repository [createSale]:${error}`);
  }
}

async function getSaleByNameWithCount(name, count) {
  try {
    return await pg(
      true,
      `
        select * from sales where name = $1 and count = $2 and is_active=true;
      `,
      name,
      count
    );
  } catch (error) {
    throw Error(`sales module repository [getSaleByNameWithCount]:${error}`);
  }
}

async function getSales() {
  try {
    return await pg(
      false,
      `
          select * from sales where is_active = true order by id desc;
        `
    );
  } catch (error) {
    throw Error(`sales modules repository [getSales]:${error}`);
  }
}

async function getSaleById(id) {
  try {
    const sale = await pg(
      true,
      `
        select * from sales where is_active = true and id = $1;
      `,
      id
    );
    return sale;
  } catch (error) {
    throw Error(`sales modules repository [getSaleById]:${error}`);
  }
}

async function updateSale(name, count, comment, id) {
  try {
    return await pg(
      true,
      `
        update sales set name = $1, count = $2, comment = $3 where id = $4 returning * ;
      `,
      name,
      count,
      comment,
      id
    );
  } catch (error) {
    throw Error(`sales modules repository [updateSale]:${error}`);
  }
}

async function deleteSale(id) {
  try {
    return await pg(
      true,
      `
          update sales set is_active = false where id = $1 returning *;
        `,
      id
    );
  } catch (error) {
    throw Error(`sales module repository [deleteSale]:${error}`);
  }
}

module.exports = {
  createSale,
  getSaleByNameWithCount,
  getSaleById,
  updateSale,
  deleteSale,
  getSales
};
