const redis = require('redis');

const rs = redis.createClient();

module.exports = rs;
