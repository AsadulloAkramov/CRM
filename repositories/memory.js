/* eslint-disable class-methods-use-this */
const rs = require('../utils/redis');

class Redis {
  addClient(connectionId, userId) {
    rs.set(userId, JSON.stringify({ connectionId, userId }));
  }

  removeClient(userId) {
    rs.del(userId);
  }

  getClient(key) {
    return new Promise((resolve, reject) => {
      rs.get(key, (err, data) => {
        if (!err) {
          resolve(JSON.parse(data));
        }
        reject(err);
      });
    });
  }
}

module.exports = {
  Redis
};
