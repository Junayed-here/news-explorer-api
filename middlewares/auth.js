const jwt = require('jsonwebtoken');
const Unauthorized = require('../error/Unauthorized');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Authorization Required!+'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-junayed-secret',
    );
  } catch (err) {
    next(new Unauthorized('Authorization Required!!'));
  }

  req.user = payload;

  next();
};
