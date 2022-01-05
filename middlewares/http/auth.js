const jwt = require('../../utils/jwt');

module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;

    jwt.verify(token);

    next();
  } catch (e) {
    res.status(401).send({
      msg: 'Unauthorized'
    });
  }
};
