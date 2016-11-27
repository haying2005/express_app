/**
 * Created by fangwenyu on 2016/11/20.
 */

var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var User = require('../../models/User.js');
var result = require('../return-result');

var cookieParser = require('cookie-parser');
var expressSsession = require('express-session');

router.use(cookieParser());
router.use(expressSsession({
    secret : 'haying2009',
    resave : false,
    saveUninitialized : false,
    cookie : {maxAge : 6000 * 60 *1000}
}));

router.post('/login', login);
router.get('/login', toLoginPage);
router.post('/signup', signup);
router.get('/info', getUserInfo);
module.exports = router;

/**
 * 登录
 * @param req
 * @param res
 */
function login(req, res) {
    //console.log('sessionID : ' + req.sessionID);
    //console.log(req.session);
    var username = req.body.LoginName;
    var pass = req.body.Password;
    if (!username || username.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '用户名不能为空');
    if (!pass || pass.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '密码不能为空');

    User.model.model.findOne({LoginName : username, Password : pass}, function (err, user) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!user) return res.errorJson(result.BUSINESS_ERROR_CODE, '用户名或密码错误');

        //成功,重建session
        req.session.regenerate(function (err) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            req.session.userId = user._id;
            req.session.userNick = user.Nick;
            req.session.right = user.Rights;
            //console.log(req.sessionID + ':' + req.session);

            //更新用户登录信息
            User.model.model.update({_id : user._id}, {LastLoginTime : new Date(), Ip : req.ip})
                .exec(function (err) {
                    if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                    res.rightJson(user);
                });

        });

    });
}

/**
 * 创建新用户 LoginName Nick 不能重复
 * todo: 密码hash加密
 */
function signup(req, res) {
    var nick = req.body.Nick;
    var loginName = req.body.LoginName;
    var pass = req.body.Password || loginName; //初始默认密码跟loginname一样

    if (!loginName) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '登录名不能为空');
    if (loginName.length < 6) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '登录名不能小于6位');

    //先判断昵称 loginname是否重复
    User.model.model.findOne({LoginName : loginName}, function (err, user) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (user) return res.errorJson(result.BUSINESS_ERROR_CODE, '登录名被使用');

        User.model.model.findOne({Nick : nick}, function (err, user) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (user) return res.errorJson(result.BUSINESS_ERROR_CODE, '昵称被使用');

            var user_ = new User.model.model({LoginName : loginName, Password : pass, Nick : nick});
            user_.save(function (err) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                res.rightJson();
            });
        });
    });
}

/**
 * 获取个人信息
 */
function getUserInfo(req, res) {
    var id = req.session.userId;
    if (!id) return res.errorJson(result.AUTH_ERROR_CODE, '身份认证失败');
    User.model.model.findOne({_id : id}, function (err, user) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!user) return res.errorJson(result.BUSINESS_ERROR_CODE, '未找到该用户');
        res.rightJson(user);
    });
}

/**
 * 输出登陆页面
 */
function toLoginPage(req, res) {
    res.render('login');
}
