const pg = require('../utils/pg');

async function getUserPermissions(phoneNumber) {
  try {
    return await pg(
      false,
      `
        select * from users as u join permissions as p on u.phone_number = $1 and p.user_id = u.id;
      `,
      phoneNumber
    );
  } catch (error) {
    throw Error(`signin repository [getUserPermissions]: ${error}`);
  }
}

async function insertVerificationCode(randomDigits, validatedPhoneNumber) {
  try {
    return await pg(
      true,
      `
        insert into verifications(code, phone_number) values($1, $2);
      `,
      randomDigits,
      validatedPhoneNumber
    );
  } catch (error) {
    throw Error(`signin repository [insertVerificationCode]: ${error}`);
  }
}

async function checkVerificationCode(validatedPhoneNumber, code) {
  try {
    return await pg(
      true,
      `
        select * from verifications where phone_number = $1 and code = $2;
      `,
      validatedPhoneNumber,
      code
    );
  } catch (error) {
    throw Error(`signin repository [checkVerificationCode]: ${error}`);
  }
}

async function getUserInfoAndRoles(validatedPhoneNumber) {
  try {
    return await pg(
      true,
      `
        select
          u.id,
          u.first_name || ' ' || u.last_name as fullname,
          array_agg(p.role_id) as roles
        from
          users as u
          join permissions as p on p.user_id = u.id
        where
          u.phone_number = $1
        group by u.id;
      `,
      validatedPhoneNumber
    );
  } catch (error) {
    throw Error(`signin repository [getUserInfoAndRoles]: ${error}`);
  }
}

async function getUserAllPermissions(roles) {
  try {
    return await pg(
      false,
      `
        select
          rc.id as access_id,
          rc.role_id,
          rc.insert,
          rc.read,
          rc.update,
          rc.delete,
          (
            select name from modules as m where m.id = rc.module_id
          )
        from
          role_access as rc
        where
          rc.role_id = any($1);
      `,
      roles
    );
  } catch (error) {
    throw Error(`signin repository [getUserAllPermissions]: ${error}`);
  }
}

module.exports = {
  getUserPermissions,
  insertVerificationCode,
  checkVerificationCode,
  getUserInfoAndRoles,
  getUserAllPermissions
};
