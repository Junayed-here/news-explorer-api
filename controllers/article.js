const Article = require('../models/article');
const NotFoundError = require('../error/NotFound');
const Forbidden = require('../error/Forbidden');

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.status(201).send(article))
    .catch(next);
};

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Card not found!');
      }
      return res.status(200).send(article);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Article not found!');
      } else if (req.user._id !== card.owner._id.toString()) {
        throw new Forbidden('request forbidden!');
      }
      Article.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).send({ message: 'Article has been successfully deleted!' }));
    })
    .catch(next);
};
