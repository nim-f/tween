const express        = require('express');
const router         = express.Router();
const mongoose       = require('mongoose');
const Events         = mongoose.model('Events');
const Counters       = mongoose.model('Counters');


router.get('/events/:id', (req, res) => {
  const { id }  = req.params
  Events.findOne({id: parseInt(id)}, function(err, result) {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result);
    }
  });
})

router.get('/events', (req, res) => {
  Events.find({}, function(err, result) {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result);
    }
  });
})

router.post('/events/:id', (req, res) => {
  const { id }  = req.params
  const event = req.body
  Events.updateOne({id}, event, function(err, numberAffected, rawResponse) {
    res.send(event);
  })
})

router.post('/events', (req, res) => {
  const event = req.body
  Counters.findOneAndUpdate(
    {name: 'eventCounter'},
    { $inc: { "value" : 1 } },
    (err, nextId) => {
      event.id = nextId.value
      const finalEvent = new Events(event);

      return finalEvent.save()
      .then(() => {
        res.json(finalEvent)
      });

    }
  )
});


module.exports = router;
