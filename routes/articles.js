const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createArticle, getArticles, deleteArticle,
} = require('../controllers/article');

router.post('/api/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    date: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
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
