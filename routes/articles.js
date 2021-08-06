const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createArticle, getArticles, deleteArticle,
} = require('../controllers/article');

router.post('/api/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().max(30).min(2).required(),
    title: Joi.string().max(30).min(2).required(),
    date: Joi.string().max(30).min(2).required(),
    text: Joi.string().max(300).min(2).required(),
    source: Joi.string().max(30).min(2).required(),
    link: Joi.string().pattern(/^https?:\/\/(www\.)?([^/]+)(\/[\w\d._~:/?%#[\]@!$&'()*+,;="-]*)?/).required(),
    image: Joi.string().pattern(/^https?:\/\/(www\.)?([^/]+)(\/[\w\d._~:/?%#[\]@!$&'()*+,;="-]*)?/).required(),
  }),
}), createArticle);

router.get('/api/articles', getArticles);

router.delete('/api/articles/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = router;
