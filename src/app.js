var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var morgan = require('morgan');
const session = require('express-session');
const logger = require('./config/winston')
require('dotenv').config()

const sqlite = require('better-sqlite3');
const db = new sqlite(path.join(__dirname, 'database', 'database.db'));

var viewsRouter = require('./routes/viewpage');
var dataRouter = require('./routes/data')(db);
var sessionRouter = require('./routes/session')
var cheatRouter = require('./routes/cheat')(db)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: logger.stream
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}))

app.use('/', viewsRouter);
app.use('/data', dataRouter);
app.use('/session', sessionRouter);
app.use('/cheat', cheatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ success: false, error: err });
  logger.error(err);
});

module.exports = app;
