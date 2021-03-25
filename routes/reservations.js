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
        ...formatReservations(reservations, Number(req.query.newProject))
      });
    } else {
      res.render('reservations', {
        message: 'There is a problem loading the table. Please try again.'
      });
    }
  });
});

function formatReservations(reservations, newProject, deleted) {
  const newReservations = [];
  let hasNewProject = false;
  if (reservations.length === 0) {
    return newReservations;
  }

  reservations.forEach((reservation) => {
    hasNewProject = hasNewProject || reservation.id === newProject;
    const status = reservation.cancelled
      ? 'CANCELLED'
      : Date.now() > (reservation.startTime * 1000)
      ? 'DONE'
      : 'UPCOMING';
    newReservations.push({
      ...reservation,
      status,
      startTimeString: new Date(reservation.startTime * 1000).toLocaleString(),
      endTimeString: new Date(reservation.endTime * 1000).toLocaleString(),
      newProject: reservation.id === newProject,
      canBeCancelled: status === 'UPCOMING'
    });
  });
  return {
    reservations: newReservations,
    hasNewProject
  };
}

module.exports = router;