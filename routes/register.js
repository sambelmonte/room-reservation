const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const log = require('../tools/log');
const router = Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', (req, res) => {
  const errors = [];
  if (!req.body.username) {
    errors.push('Username is required.')
  } else if (!req.body.username.match(/^[0-9a-zA-Z_]+$/)) {
    errors.push('Characters in a username should be alphanumeric or underscore.')
  } else if (req.body.username.length > 32) {
    errors.push('Username should not exceed 32 characters.')
  }

  if (!req.body.password) {
    errors.push('Password is required.')
  } else if (!req.body.password.match(/^[0-9a-zA-Z]+$/)) {
    errors.push('Password should be alphanumeric.')
  } else if (req.body.password.length < 8) {
    errors.push('Password should be 8 characters or more.')
  }

  if (errors.length > 0) {
    res.render('register', {
      message: errors.join(' ')
    });
  } else {
    const { username, password } = req.body;

    request({
      url: `${directory}/user/new`,
      method: 'POST',
      json: {
        username,
        password
      }
    }, (error, response, body) => {
      if (error) {
        log('POST /register', 'request', req.body.username, error);
        res.render('register', {
          message: 'There is a problem with your request. Please try again.'
        });
      } else if (response.statusCode === 200) {
        res.cookie('AuthToken', body.key);
        req.session.message = 'You have successfully registered. You may reserve a room now.';
        res.redirect('/');
      } else {
        log('POST /register', 'request', req.body.username, response);
        res.render('register', {
          message: 'There is a problem with your request. Please try again.'
        });
      }
    });
  }
});

module.exports = router;