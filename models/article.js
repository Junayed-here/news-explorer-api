const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const isDate = require('validator/lib/isDate');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    validate: {
      validator: (v) => isDate(v),
      message: (props) => `${props.value} is not a valid date!`,
    },
    required: [true, 'Date is required!'],
  },
  source: {
    type: String,
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
