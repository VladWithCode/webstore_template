const router = require('express').Router();

const { singup, signin } = require('../../controllers/auth.ctrl');

router.post('/signup', singup);

router.post('/signin', signin);

module.exports = router;
