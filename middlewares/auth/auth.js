const pg = require('../../utils/pg');
const jwt = require('../../utils/jwt');
const { getUserRoles, getUserRoleAccess } = require('./queries');

module.exports = async (method, moduleName, token) => {
  try {
    if (!token) {
      return false;
    }

    const payload = jwt.verify(token);
    console.log(payload);
    const data = await pg(true, getUserRoles, payload.userId);

    const permissions = await pg(true, getUserRoleAccess, data?.roles, moduleName);

    if (!permissions || !permissions[method]) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
