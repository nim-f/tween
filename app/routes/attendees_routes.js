const express        = require('express');
const router         = express.Router();
const mongoose       = require('mongoose');
const Attendees         = mongoose.model('Attendees');
const Counters       = mongoose.model('Counters');

router.post('/attendees', (req, res) => {
  const attendee = req.body
  Counters.findOneAndUpdate(
    {name: 'attendeeCounter'},
    { $inc: { "value" : 1 } },
    (err, nextId) => {
      attendee.id = nextId.value
      const att = new Attendees(attendee);

      return att.save()
      .then(() => {
        res.json(att)
      });

    }
  )
});

router.get('/attendees', (req, res) => {
  console.log({req: req.query})
  const {event} = req.query
  Attendees.aggregate([
    { "$match": { "event": parseInt(event)} },
  ], function(err, result) {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result);
    }
  });
})

module.exports = router;
