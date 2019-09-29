const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const Users = mongoose.model('Users');
const dbConfig = require('../config/db');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  Users.findOne({ email })
  .then((user) => {
    if(!user || !user.validatePassword(password)) {
      return done(null, false, { errors: { 'email or password': 'is invalid' } });
    }

    return done(null, user);
  }).catch(done);
}));


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: dbConfig.secret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  if (payload) done(null, payload)
}));
