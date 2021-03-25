const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.clearCookie('AuthToken');
  res.redirect('/');
});

module.exports = router;