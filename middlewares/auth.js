const jwt = require('jsonwebtoken');
const Unauthorized = require('../error/Unauthorized');

const { JWT_SECRET, NODE_ENV } = process.env;

// An array of domains from which cross-domain requests are allowed
const allowedCors = [
  'https://news.mdjunayed.com',
  'http://news.mdjunayed.com',
  'https://api.news.mdjunayed.com',
  'http://api.news.mdjunayed.com'
];

app.use(function(req, res, next) {
  const { origin } = req.headers; // saving the request source to the 'origin' variable
  // checking that the source of the request is mentioned in the list of allowed ones 
  if (allowedCors.includes(origin)) {
    // setting a header that allows the browser to make requests from this source
    res.header('Access-Control-Allow-Origin', origin);

    // setting a header that allows the browser to make requests from any source
    // res.header('Access-Control-Allow-Origin', "*");

  }

  next();
});

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Authorization Required!'));
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
