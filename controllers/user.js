const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../error/NotFound');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
    const {
        name, email, password,
    } = req.body;
    bcrypt.hash(password, 10)
        .then((hash) => User.create({
            name,
            email,
            password: hash,
        }))
        .then((user) => {
            res.status(201).send({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        })
        .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
    User.findById({ _id: req.user._id })
        .then((user) => {
            if (!user) {
                throw new NotFoundError('User not found!');
            }
            return res.status(200).send({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        })
        .catch(next);
};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('User not found!');
            }
            res
                .status(200)
                .send({
                    token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-junayed-secret', { expiresIn: '7d' }),
                });
        })
        .catch(next);
};
