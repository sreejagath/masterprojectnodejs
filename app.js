var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var tutorRouter = require('./routes/tutor');
var studentRouter = require('./routes/student');
var userRouter = require('./routes/user');
var hbs = require('express-handlebars')
var app = express();
var db=require('./config/connection')
var fileUpload = require('express-fileupload')
var session=require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
var nodemailer=require('nodemailer')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret:"Key",cookie:{maxAge:600000000}}));
db.connect((err)=>{
  if(err) console.log("Error"+err);
  console.log("Database connected to port");
})
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  collection: 'mySessions'
});
store.on('error', function(error) {
  console.log(error);
});
app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));
app.use(fileUpload());
app.use('/student', studentRouter);
app.use('/tutor', tutorRouter);
app.use('/', userRouter);
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
  res.render('error');
});

module.exports = app;
