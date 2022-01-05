/* eslint-disable operator-linebreak */
const Response = require('../../shared/core/Response');
const { ResponseTypes } = require('../../shared/core/ResponseTypes');
const jwt = require('../../utils/jwt');
const pg = require('../../utils/pg');
const { getUserRoles, getUserRoleAccess } = require('./queries');

const errorOptions = {
  'jwt malformed': Response.set(ResponseTypes.forbidden, 'Forbidden', null),
  'invalid token': Response.set(ResponseTypes.forbidden, 'Forbidden', null)
};

const Auth = (moduleName, permissionName) => (next) => async (root, args, context, info) => {
  try {
    const { token } = context;

    if (!token) {
      return Response.set(ResponseTypes.unauthorized, 'Unauthorized', null);
    }

    const payload = jwt.verify(token);

    const userId = +payload.userId || null;

    if (!userId) {
      return Response.set(ResponseTypes.forbidden, 'Forbidden', null);
    }

    const roles = await pg(true, getUserRoles, payload.userId);

    if (!roles?.list?.length) {
      return Response.set(ResponseTypes.forbidden, 'Forbidden', null);
    }

    const roleAccesses = await pg(false, getUserRoleAccess, roles.list, moduleName);

    const activeRoleAccesses = {};

    roleAccesses.forEach((roleAccess) => {
      const keys = Object.keys(roleAccess);

      keys.forEach((key) => {
        if (!activeRoleAccesses[roleAccess.module_name]) {
          activeRoleAccesses[roleAccess.module_name] = roleAccess;
        } else if (!activeRoleAccesses[roleAccess.module_name][key]) {
          activeRoleAccesses[roleAccess.module_name][key] = roleAccess[key];
        } else if (
          activeRoleAccesses[roleAccess.module_name][key] === false &&
          roleAccess[key] === true
        ) {
          activeRoleAccesses[roleAccess.module_name][key] = true;
        }
      });
    });

    if (!activeRoleAccesses[moduleName]) {
      return Response.set(ResponseTypes.forbidden, 'Forbidden', null);
    }

    return activeRoleAccesses[moduleName][permissionName]
      ? next(root, args, context, info)
      : Response.set(ResponseTypes.forbidden, 'Forbidden', null);
  } catch (error) {
    console.log(error);
    return errorOptions[error.message]
      ? errorOptions[error.message]
      : Response.set(ResponseTypes.fail, 'Internal Server Error', null);
  }
};

module.exports = Auth;
