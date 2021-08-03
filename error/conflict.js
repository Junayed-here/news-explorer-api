module.exports = (err, req, res, next) => {
  let { statusCode = 500, message = 'An error occurred on the server' } = err;
  if (err.name === 'ValidationError' && !err.statusCode) {
    statusCode = 400;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = 'Something went wrong!!';
  } else if (err.name === 'Error' && !err.statusCode) statusCode = 401;

  res.status(statusCode).send({ message });
  next();
};
