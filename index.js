const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const app            = express();
const port = 8000;
const dbConfig             = require('./config/db');
mongoose.promise = global.Promise;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tvveen', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(errorHandler());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

mongoose.connect(dbConfig.url, { useNewUrlParser: true });
mongoose.set('debug', true);
require('./app/models/Users');
require('./app/models/Counters');
require('./app/models/Events');
require('./config/passport');
require('./app/routes')(app)
//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(port, () => {
  console.log('We are live on ' + port);
});
