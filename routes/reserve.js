const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const router = Router();

router.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  request({
    url: `${directory}/reserve/${id}`,
    method: 'DELETE',
    headers: {
      auth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      res.redirect('/');
    } else if (response.statusCode === 200) {
      res.redirect('/');
    } else if (response.statusCode === 404) {
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

router.get('/', (req, res) => {
  request({
    url: `${directory}/room`,
    method: 'GET',
    headers: {
      auth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      res.render('reserve', {
        message: 'There is a problem loading the rooms. Please try again.'
      });
    } else if (response.statusCode === 200) {
      const { rooms } = JSON.parse(body);
      res.render('reserve', {
        rooms
      });
    } else {
      res.render('reserve', {
        message: 'There is a problem loading the rooms. Please try again.'
      });
    }
  });
});

router.post('/', (req, res) => {
  console.log(req.body)
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
    res.render('reserve', {
      message: errors.join(' ')
    });
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
        res.render('reserve', {
          message: 'There is a problem with your request. Please try again.'
        });
      } else if (response.statusCode === 200) {
        res.redirect(`/?newProject=${body.reservationId}`);
      } else if (response.statusCode === 400) {
        res.render('reserve', {
          message: body.message
        });
      } else {
        res.render('reserve', {
          message: 'There is a problem with your request. Please try again.'
        });
      }
    });
  }
});

module.exports = router;