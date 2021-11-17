const router = require('express').Router();

const { singup, signin, signOut } = require('../../controllers/auth.ctrl');

router.post('/signup', singup);

router.post('/signin', signin);

router.get('/signout', signOut);

module.exports = router;
