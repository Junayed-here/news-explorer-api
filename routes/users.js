const router = require('express').Router();
const { getCurrentUser } = require('../controllers/user');

router.get('/api/users/me', getCurrentUser);

module.exports = router;
