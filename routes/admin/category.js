/**
 * Created by fangwenyu on 2016/11/20.
 */

//var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Category = require('../../models/Category');
var result = require('../return-result');
var languages = require('../../models/Language');


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
    var lang = req.body.lang;

    if(!name) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'name不能为空');
    if (!root && !fatherId) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'root跟fatherId至少要有一样');
    if (root && fatherId) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'root跟fatherId只能有一样');
    if (!lang && !fatherId && root) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '根目录lang不能为空');
    if (!containLang(lang) && root && !fatherId) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'lang:' + lang + '不被支持');


    if (fatherId && !root) {
        //查询fatherId是否存在
        Category.model.model.findOne({_id : fatherId}, function(err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (!item || item.count == 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'fatherId不存在');
            //字分类的lang等于父分类的lang
            var lang_ = item.lang;
            //查询该fatherid下 是否有重名的category
            Category.model.model.findOne({fatherId : fatherId, name : name}, function (err, item) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                if (item) return res.errorJson(result.BUSINESS_ERROR_CODE, '有同名子分类');
                var category = new Category.model.model({name : name, fatherId : fatherId, lang : lang_});
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
            var category = new Category.model.model({name : name, root : root, lang : lang});
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
    var condition = {};
    if (root)
        condition.root = root;
    if (fatherId)
        condition.fatherId = fatherId;

    //console.log('condition' + JSON.stringify(condition));

    Category.model.model.find(condition, null, {lean : true}, function (err, items) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        items.map(function (item) {
            item.lang = item.lang || "zh-CN";   //如果lang为空,则默认认为其为简体中文
            item.lang = getLangInfoWithKey(item.lang);
        });
        res.rightJson(items);
    })
}

/*
判断语言码是否在所支持的语言数组中
 */
function containLang(langKey) {
    console.log(languages);
    var boolValue = false;

    for (var i = 0; i < languages.length; i ++) {
        if (languages[i].key == langKey) {
            boolValue = true;
            break;
        }
    }

    return boolValue;
}

/*
根据语言key 获取语言信息对象
 */
function getLangInfoWithKey(langKey) {
    for (var i = 0; i < languages.length; i ++) {
        if (languages[i].key == langKey) {
            return languages[i];
        }
    }
    return {};
}