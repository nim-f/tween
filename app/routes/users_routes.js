const express        = require('express');
const router         = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('./auth');
const Users = mongoose.model('Users');
const Counters = mongoose.model('Counters');

router.post('/users/add',  auth.optional, (req, res, next) => {
  const user = req.body;
  console.log(user)

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  Users.findOne({email: user.email},(err, result) => {
    if (result) {
      res.status(400).send({ error: 'Email is already in use'})
    } else {
      Counters.findOneAndUpdate(
        {name: 'userCounter'},
        { $inc: { "value" : 1 } },
        (err, nextId) => {
          console.log(err, nextId)
          user.id = nextId.value
          const finalUser = new Users(user);
          finalUser.setPassword(user.password);
          return finalUser.save()
          .then(() => res.json({ user: finalUser.toAuthJSON() }));
        }
      )

    }
  })

});


router.post('/login', auth.optional, (req, res, next) => {
  const user = req.body;
  console.log(user)

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).json(info);
  })(req, res, next);
});

router.get('/users/current', (req, res, next) => {
  return passport.authenticate('jwt',{ session: false }, function (err, user, info) {
    console.log(err, user, info)
    Users.findById(user.id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
      return res.json({ user: user.toAuthJSON() });
    });
  })(req, res, next)
});


router.get('/users', (req, res, next) => {
  return passport.authenticate('jwt',{ session: false }, function (err, user, info) {
    console.log(err, user, info)
    Users.find({}, function(err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result);
      }
    });
  })(req, res, next)
});




module.exports = router;
