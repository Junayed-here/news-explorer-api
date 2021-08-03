const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: (v) => isEmail(v),
            message: 'Wrong email format',
        },
        required: [true, 'A valid email address is required!'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
    return this.findOne({ email }).select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Incorrect email or password'));
            }
            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        return Promise.reject(new Error('Incorrect email or password'));
                    }
                    return user;
                });
        });
};

module.exports = mongoose.model('user', userSchema);
