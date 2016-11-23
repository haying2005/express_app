/**
 * Created by fangwenyu on 2016/11/20.
 */

//var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Category = require('../../models/Category');
var result = require('../return-result');


router.post('/', createCategory);
router.get('/', getCategorys);
module.exports = router;

/*
    创建分类
 */

function createCategory(req, res) {
    var name = req.body.name;
    var fatherId = req.body.fatherId;
    var root = parseInt(req.body.root);
    if(!name) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'name不能为空');
    if (!root && !fatherId) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'root跟fatherId至少要有一样');
    if (root && fatherId) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'root跟fatherId只能有一样');

    if (fatherId && !root) {
        //查询fatherId是否存在
        Category.model.model.findOne({_id : fatherId}, function(err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (!item || item.count == 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'fatherId不存在');
            //查询该fatherid下 是否有重名的category
            Category.model.model.findOne({fatherId : fatherId, name : name}, function (err, item) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                if (item) return res.errorJson(result.BUSINESS_ERROR_CODE, '有同名子分类');
                var category = new Category.model.model({name : name, fatherId : fatherId});
                category.save(function (err) {
                    if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                    res.rightJson(category);
                });
            });
        });
    }
    //如果fatherId参数没传, 就创建一个一级分类

    else if(!fatherId && root)  {
        if (root <=0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'root必须大于0');
        //查询该root下 是否有重名的category
        Category.model.model.findOne({root : root, name : name}, function (err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (item) return res.errorJson(result.BUSINESS_ERROR_CODE, '分类名已经被占用');
            var category = new Category.model.model({name : name, root : root});
            category.save(function (err) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                res.rightJson(category);
            });
        });
    }
}

/**
 * 获取分类列表 考虑到分类不会很多,所以不做分页,可根据root或者categorye二选一作为查询条件
 */
function getCategorys(req, res) {
    var root = parseInt(req.query.root);
    var fatherId = req.query.fatherId;
    if (root && fatherId) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'fatherId跟root只能穿一个');
    var condition = root ? {root : root} : {fatherId : fatherId};

    Category.model.model.find(condition, function (err, items) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(items);
    })
}