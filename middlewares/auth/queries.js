module.exports = {
  getUserRoles: `
    select array_agg(role_id) as list from permissions where user_id = $1 group by user_id;
  `,
  getUserRoleAccess: `
    select
      read,
      insert,
      update,
      delete,
      (
        select name from modules where modules.id = role_access.module_id
      ) as module_name
    from
      role_access
    where
      role_id = any($1) and module_id = (select id from modules where name = $2 limit 1);
  `
};
