const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const { decryptKey } = require('../tools/encrypt');
const log = require('../tools/log');
const router = Router();

router.get('/delete/:id', (req, res) => {
  const { username } = decryptKey(req.cookies['AuthToken']);
  const id = req.params.id;

  request({
    url: `${directory}/reserve/${id}`,
    method: 'DELETE',
    headers: {
      auth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      log('GET /reserve/delete', 'request', username, error);
      req.session.message = 'There is a problem cancelling the reservation. Please try again.';
      res.redirect('/');
    } else if (response.statusCode === 200) {
      req.session.message = 'The reservation is successfully cancelled.';
      req.session.cancelledReservation = id;
      res.redirect('/');
    } else if (response.statusCode === 404) {
      req.session.message = 'The reservation you are trying to cancel does not exist.';
      res.redirect('/');
    } else {
      log('GET /reserve/delete', 'request', username, response);
      req.session.message = 'There is a problem cancelling the reservation. Please try again.';
      res.redirect('/');
    }
  });
});

router.get('/', (req, res) => {
  const { username } = decryptKey(req.cookies['AuthToken']);

  request({
    url: `${directory}/room`,
    method: 'GET',
    headers: {
      auth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      log('GET /reserve', 'request', username, error);
      req.session.message = 'There is a problem loading the rooms. Please try again';
      res.redirect('/reserve');
    } else if (response.statusCode === 200) {
      const { rooms } = JSON.parse(body);
      res.render('reserve', {
        rooms,
        message: req.session.message
      });
      delete req.session.message;
    } else {
      log('GET /reserve', 'request', username, response);
      req.session.message = 'There is a problem loading the rooms. Please try again';
      res.redirect('/reserve');
    }
  });
});

router.post('/', (req, res) => {
  const { username } = decryptKey(req.cookies['AuthToken']);

  const errors = [];
  if (!req.body.roomId) {
    errors.push('Room is required.');
  }
  if (!req.body.startTime) {
    errors.push('Start time is required.');
  }
  if (!req.body.endTime) {
    errors.push('End time is required.');
  }
  if (!req.body.peopleCount) {
    errors.push('Number of people is required.');
  }

  if (errors.length > 0) {
    req.session.message = errors.join('');
    res.redirect('/reserve');
  } else {
    const { roomId, startTime, endTime, peopleCount } = req.body;

    request({
      url: `${directory}/reserve`,
      method: 'POST',
      headers: {
        auth: req.cookies['AuthToken']
      },
      json: {
        roomId: Number(roomId),
        startTime: new Date(startTime).getTime()/1000,
        endTime: new Date(endTime).getTime()/1000,
        peopleCount: Number(peopleCount)
      }
    }, (error, response, body) => {
      if (error) {
        log('POST /reserve', 'request', username, error);
        req.session.message = 'There is a problem with your request. Please try again';
        res.redirect('/reserve');
      } else if (response.statusCode === 200) {
        req.session.message = 'Your reservation is successfully recorded.';
        req.session.newReservation = body.reservationId;
        res.redirect('/');
      } else if (response.statusCode === 400) {
        req.session.message = body.message;
        res.redirect('/reserve');
      } else {
        log('POST /reserve', 'request', username, response);
        req.session.message = 'There is a problem with your request. Please try again';
        res.redirect('/reserve');
      }
    });
  }
});

module.exports = router;