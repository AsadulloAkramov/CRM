const jwt = require('jsonwebtoken');
const { JWT } = require('../config');

module.exports = {
  sign: (payload) => jwt.sign(payload, JWT.key, { expiresIn: JWT.expiration }),
  verify: (token) => jwt.verify(token, JWT.key)
};
