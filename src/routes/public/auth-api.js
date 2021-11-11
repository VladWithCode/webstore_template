const router = require('express').Router();

const { singup } = require('../../controllers/auth.ctrl');

router.post('/signup', singup);

router.post('/signin', )

module.exports = router;
