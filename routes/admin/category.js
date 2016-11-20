/**
 * Created by fangwenyu on 2016/11/20.
 */

//var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Category = require('../../models/Category');
var result = require('../return-result');

var cookieParser = require('cookie-parser');
var expressSsession = require('express-session');

router.use(cookieParser());
router.use(expressSsession({
    secret : 'haying2009',
    resave : false,
    saveUninitialized : false,
    cookie : {maxAge : 60 * 60 *1000}
}));

router.post('/', createCategory);
router.get('/', getCategorys);
module.exports = router;

/*
    创建分类
 */

function createCategory(req, res) {
    var name = req.body.name;
    var fatherId = req.body.fatherId;
    if(!name) {
        res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'name不能为空');
        return;
    }
    if (fatherId) {
        //查询fatherId是否存在
        Category.model.model.findOne({_id : fatherId}, function(err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (!item || item.count == 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'fatherId不存在');
            //查询该fatherid下 是否有重名的category
            Category.model.model.findOne({fatherId : fatherId, name : name}, function (err, item) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                if (item) return res.errorJson(result.BUSINESS_ERROR_CODE, '分类名已经被占用');
                var category = new Category.model.model({name : name, fatherId : fatherId});
                category.save(function (err) {
                    if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                    res.rightJson(category);
                });
            });
        });
    }
    //如果fatherId参数没传, 就创建一个根分类
    else  {
        //查询该fatherid下 是否有重名的category
        Category.model.model.findOne({fatherId : null, name : name}, function (err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (item) return res.errorJson(result.BUSINESS_ERROR_CODE, '分类名已经被占用');
            var category = new Category.model.model({name : name, fatherId : fatherId});
            category.save(function (err) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                res.rightJson(category);
            });
        });
    }
}

/**
 * 获取分类列表 考虑到分类不会很多,所以不做分页, fatherId不传就获取所有分类,传0就获取一级分类
 */
function getCategorys(req, res) {
    var fatherId = req.query.fatherId;
    var condition = fatherId ? {fatherId : fatherId} : null;
    if (parseInt(fatherId) === 0) {
        condition = {fatherId : null};
    }
    Category.model.model.find(condition, function (err, items) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(items);
    })
}