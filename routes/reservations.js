const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const router = Router();

router.get('/', (req, res) => {
  request({
    url: `${directory}/reserve`,
    method: 'GET',
    headers: {
      auth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      res.render('reservations', {
        message: 'There is a problem loading the table. Please try again.'
      });
    } else if (response.statusCode === 200) {
      const { reservations } = JSON.parse(body);
      res.render('reservations', {
        hasReservations: reservations.length > 0,
        message: req.session.message,
        ...formatReservations(reservations, Number(req.session.newReservation || req.session.cancelledReservation))
      });
      delete req.session.message;
      delete req.session.newReservation;
      delete req.session.cancelledReservation;
    } else {
      res.render('reservations', {
        message: 'There is a problem loading the table. Please try again.'
      });
    }
  });
});

function formatReservations(reservations, newReservation) {
  const newReservations = [];
  let hasNewReservation = false;
  if (reservations.length === 0) {
    return newReservations;
  }

  reservations.forEach((reservation) => {
    hasNewReservation = hasNewReservation || reservation.id === newReservation;
    const status = reservation.cancelled
      ? 'CANCELLED'
      : Date.now() > (reservation.startTime * 1000) && Date.now() < (reservation.endTime * 1000)
      ? 'ONGOING'
      : Date.now() > (reservation.startTime * 1000)
      ? 'DONE'
      : 'UPCOMING';
    newReservations.push({
      ...reservation,
      status,
      startTimeString: new Date(reservation.startTime * 1000).toLocaleString(),
      endTimeString: new Date(reservation.endTime * 1000).toLocaleString(),
      newReservation: reservation.id === newReservation,
      canBeCancelled: status === 'UPCOMING'
    });
  });
  return {
    reservations: newReservations,
    hasNewReservation
  };
}

module.exports = router;