"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
const checkVersion=require('./utils/checkVersion.js').checkVersion;
//引入web路由，Restrful路由
var webroute = require('./routes/web.js');
var restful= require('./routes/restful.js');
const sync=require('./model/db/syncfordb.js');
var checkKey=require('./utils/checkKey.js').checkKey;
var version=require('./controller/restful/version.js');
require('./utils/jpush');



var app = express();

console.time('redis-ready');
//加载缓存内容
sync.insyncOfcity();
sync.insyncOffleet();
sync.insyncVersion();
sync.insyncCoupon();
console.timeEnd('redis-ready');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//Redis持久化Session操作
app.use(session({
  secret: 'sdsdsds',
  key: 'dsdssd',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    host: "localhost",
    port: 6379,
    ttl: 18000 })
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', webroute);
app.use('/api/version',version.checkVersion);
app.use('/api/',checkVersion);
app.use('/api/',checkKey);
app.use('/api/', restful);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
