const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    title: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    text: {
        type: String,
        minlength: 2,
        maxlength: 300,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    source: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    link: {
        type: String,
        validate: {
            validator: (v) => isURL(v),
            message: (props) => `${props.value} is not a valid URL!`,
        },
        required: [true, 'Articles URL is required!'],
    },
    image: {
        type: String,
        validate: {
            validator: (v) => isURL(v),
            message: (props) => `${props.value} is not a valid URL!`,
        },
        required: [true, 'Articles image URL is required!'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
});

module.exports = mongoose.model('article', articleSchema);
