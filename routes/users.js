var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var result = require('./return-result');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  User.model.getItems(0, 100, function (err, items) {
    if(err) {
      res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
    }
    else {
      res.rightJson(items);
    }

  })
});

//登录路由
router.post('/login', function (req, res, next) {
  var loginname = req.body.loginName;
  var pass = req.body.password;
  if (!loginname) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '用户名不能为空');
  if (!pass) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '密码不能为空');
  User.model.model.findOne({LoginName : loginname, Password : pass}, {Password : 0}, function (err, user) {
    if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
    if (!user) return res.errorJson(result.TARGET_NOT_EXIT_ERROR_CODE, '用户名或密码不正确');
    res.rightJson(user);
    //更新最后登录时间
    User.model.model.update({_id : user._id}, {LastLoginTime : new Date(), Ip : res.Ip}, function (err, user) {
      if(err) console.log('更新用户登录信息失败');
    });
  });

});


module.exports = router;
