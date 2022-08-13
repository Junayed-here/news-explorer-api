const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const NotFound = require('./error/NotFound');
const conflict = require('./error/conflict');
require('dotenv').config();
const index = require('./routes/index');
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');

const { PORT, DATABASEURL } = process.env;
const app = express();

mongoose.connect(DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app.use(requestLogger);
app.use(rateLimiter);

app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/', index);

app.use('*', (req, res, next) => {
  next(new NotFound('Requested resource not found!!!'));
});

app.use(errorLogger);
app.use(errors());
app.use(conflict);
app.listen(PORT);
