const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const router = Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  const errors = [];
  if (!req.body.username) {
    errors.push('Username is required.');
  }
  if (!req.body.password) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    res.render('login', {
      message: errors.join(' ')
    });
  } else {
    const { username, password } = req.body;

    request({
      url: `${directory}/user/login`,
      method: 'POST',
      json: {
        username,
        password
      }
    }, (error, response, body) => {
      if (error) {
        res.render('login', {
          message: 'There is a problem with your request. Please try again.'
        });
      } else if (response.statusCode === 200) {
        res.cookie('AuthToken', body.key);
        res.redirect('/');
      } else if (response.statusCode === 400 || response.statusCode === 404) {
        res.render('login', {
          message: 'Wrong username and/or password.'
        });
      } else {
        res.render('login', {
          message: 'There is a problem with your request. Please try again.'
        });
      }
    });
  }
});

module.exports = router;