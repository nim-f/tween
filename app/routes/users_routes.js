const express        = require('express');
const router         = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('./auth');
const Users = mongoose.model('Users');
const Counters = mongoose.model('Counters');

router.post('/users/add',  auth.optional, (req, res, next) => {
  const user = req.body;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'Email is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'Password is required',
      },
    });
  }

  Users.findOne({email: user.email},(err, result) => {
    if (result) {
      res.status(400).send({ errors: {email: 'Email is already in use'}})
    } else {
      Counters.findOneAndUpdate(
        {name: 'userCounter'},
        { $inc: { "value" : 1 } },
        (err, nextId) => {
          user.id = nextId.value
          const finalUser = new Users(user);
          finalUser.setPassword(user.password);
          return finalUser.save()
          .then(() => res.json(finalUser.toAuthJSON()));
        }
      )

    }
  })

});


router.post('/login', auth.optional, (req, res, next) => {
  const user = req.body;

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

      return res.json(user.toAuthJSON());
    }
    return res.status(400).json({errors: {email: 'Incorrect email or password'}});
  })(req, res, next);
});

router.get('/users/current', (req, res, next) => {
  return passport.authenticate('jwt',{ session: false }, function (err, user, info) {
    Users.findById(user.id)
    .then((user) => {
      if(!user) {
        return res.status(400).json({errors: {detail: info.message }});
      }
      return res.json(user.toAuthJSON());
    });
  })(req, res, next)
});


router.get('/users', (req, res, next) => {
  return passport.authenticate('jwt',{ session: false }, function (err, user, info) {
    const name = new RegExp(req.query.q, 'ig');
    Users.aggregate([
      { "$project": {
        "name": { "$concat" : [ "$first_name", " ", "$last_name" ] },
        "first_name": 1,
        "last_name": 1,
        "email": 1,
        "id": 1,
      } },
      { "$match" : { "name": name} }
    ]).exec(function(err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result);
      }
    });
  })(req, res, next)
});




module.exports = router;
