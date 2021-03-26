const { Router } = require('express');
const { decryptKey } = require('../tools/encrypt');
const router = Router();

router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/register', require('./register'));
router.use('/reserve', allAuth, require('./reserve'));
router.use('/', homeAuth, require('./reservations'));

function homeAuth(req, res, next) {
  const auth = req.cookies['AuthToken'];

  if (!auth) {
    res.render('home');
  } else {
    const { expiry } = decryptKey(auth);
    if (expiry < Date.now()) {
      res.clearCookie('AuthToken');
      res.redirect('/');
    }

    next();
  }
}

function allAuth(req, res, next) {
  const auth = req.cookies['AuthToken'];

  if (!auth) {
    res.clearCookie('AuthToken');
    res.redirect('/');
  } else {
    const { expiry } = decryptKey(auth);
    if (expiry < Date.now()) {
      res.clearCookie('AuthToken');
      res.redirect('/');
    }

    next();
  }
}

module.exports = router;