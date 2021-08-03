const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const auth = require('./middlewares/auth');
const NotFound = require('./error/NotFound');
const conflict = require('./error/conflict');
require('dotenv').config();
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
    PORT = 3000,
    DATABASEURL = "mongodb://localhost:27017/newsExplorer",
} = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsExplorer', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app.use(requestLogger);
app.use(limiter);

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

app.use('/', auth, userRouter);
app.use('/', auth, articleRouter);

app.use('*', (req, res, next) => {
    next(new NotFound('Requested resource not found!!!'));
});

console.log("app run successful!");

app.use(errorLogger);
app.use(errors());
app.use(conflict);
app.listen(PORT);