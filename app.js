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
