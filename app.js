var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var category = require('./routes/category');
var photo = require('./routes/photo');

var adminUsers = require('./routes/admin/users');
var adminCategory = require('./routes/admin/category');
var adminPost = require('./routes/admin/post');
var adminPhoto = require('./routes/admin/photos');

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


var result = require('./routes/return-result.js');
app.use(result.resultMiddle);

var expressSsession = require('express-session');
app.use(expressSsession({
  secret : 'haying2009',
  resave : false,
  saveUninitialized : false,
  cookie : {maxAge : 60 * 60 *1000}
}));

//获取访问IP
app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress; //设置ip
  req.ip = ip;//将解析后的ip放入req中,一遍方便使用

  next();
});

//身份验证
//app.use(loginValidate);


app.use('/', index);
// app.use('/users', users);
// app.use('/categorys', category);
//  app.use('/photos', photo);
app.use('/admin/users', adminUsers);
app.use('/admin/categorys', adminCategory);
app.use('/admin/posts', adminPost);
app.use('/admin/photos', adminPhoto);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors (err, req, res, next) {
  //console.error(err.stack)
  next(err)
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', { error: err })
}


//身份验证
function loginValidate (req, res, next) {
  // req.session.userId;
  // req.session.userNick;
  // req.session.right;
  if (req.session.userId){
    req.isLogin = true;
    next();
  }
  else {
    req.isLogin = false;
    console.log(req.url);
    var reg = new RegExp('^/admin/');
    if (reg.test(req.url)) {
      if (req.url === '/admin/users/login' && req.method.toLowerCase() === "post" || req.url ==='/admin/users/signup' && req.method.toLowerCase() === 'post') next();
      else return res.errorJson(result.AUTH_ERROR_CODE, '身份验证失败');
    }
    else next();
  }

}


module.exports = app;
