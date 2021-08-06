const router = require('express').Router();
const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middlewares/auth');

router.use('/', auth, userRouter);
router.use('/', auth, articleRouter);

module.exports = router;
