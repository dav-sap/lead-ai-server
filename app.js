var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var consultants = require('./routes/consultants');
// var photographers = require('./routes/photographers');
var mongoose = require('mongoose');
let USER = null;
let PASS = null;
let URL = null;
if (process.env.NODE_ENV === "development") {
    let config = require('./config/development.json')
    USER = config.DB_SERVER.DB_USER;
    PASS = config.DB_SERVER.DB_PASS;
    URL = config.DB_SERVER.SERVER_URL;
} else {
    let config = require('./config/production.json')
    USER = config.DB_SERVER.DB_USER;
    PASS = config.DB_SERVER.DB_PASS;
    URL = config.DB_SERVER.SERVER_URL;
}
mongoose.connect('mongodb://' + USER + ':' + PASS + '@' + URL);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/../client/src/static')));

app.use('/', index);
app.use('/users', users);
app.use('/consultants', consultants);
// app.use('/photographers', photographers);
app.use(express.static(path.join(__dirname, '/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
