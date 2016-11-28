/**
 * Created by fangwenyu on 2016/11/28.
 */

//var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Product = require('../../models/Product');
var Category = require('../../models/Category');
var result = require('../return-result');

router.post('/', createProduct);
router.get('/:id', getProductById);
router.get('/', getProductList);
router.get('/count', getProductCount);
router.use('/', updateProduct);

module.exports = router;

/*
创建产品
 */
function createProduct(req, res) {
    var body = req.body;

    if (!body.category || body.category.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'category不能为空');
    if (!body.title || body.title.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'title不能为空');
    if (!body.brief || body.brief.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'brief不能为空');
    if (!body.content || body.content.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'content不能为空');
    if (!req.session.userId) return res.errorJson(result.AUTH_ERROR_CODE, '用户身份验证失败,无法添加product');

    //检查categoryId 是否存在
    Category.model.model.findOne({_id : body.category}, function (err, item) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!item) return res.errorJson(result.BUSINESS_ERROR_CODE, 'Category不存在');
        product = new Product.model.model({
            title : body.title,
            by : req.session.userId,
            brief : body.brief,
            thumbnail : body.thumbnail,
            content : body.content,
            publish : body.publish,
            recommend : body.recommend,
            category : body.category,
            pics : body.pics
        });
        product.save(function (err) {
            if (err) res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            res.rightJson(product);
        });
    });
}

/*
修改产品
 */
function updateProduct(req, res) {
    if (req.method.toLowerCase() === 'put'){

        var body = req.body;

        if (!body._id) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '_id不能为空');

        if (!body.category || body.category.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'category不能为空');
        if (!body.title || body.title.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'title不能为空');
        if (!body.brief || body.brief.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'brief不能为空');
        if (!body.content || body.content.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'content不能为空');
        if (!req.session.userId) return res.errorJson(result.AUTH_ERROR_CODE, '用户身份验证失败,无法修改product');

        var update = {
            title : body.title,
            by : req.session.userId,
            brief : body.brief,
            thumbnail : body.thumbnail,
            content : body.content,
            publish : body.publish,
            recommend : body.recommend,
            category : body.category,
            pics : body.pics
        };

        Product.model.model.findByIdAndUpdate({_id : body._id}, update, function (err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            res.rightJson();
        })
    }

    else next();
}

/**
 * 根据id查询
 */
function getProductById(req, res, next) {
    var id = req.params.id;
    if (id == 'count') return next('route');    //获取数目接口

    Product.model.model.findOne({_id : id}, function (err, item) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!item) return res.errorJson(result.TARGET_NOT_EXIT_ERROR_CODE, '该id不存在');
        res.rightJson(item);
    })
}

/**
 * 获取列表 目前的条件只有category 没有其他查询条件
 */
function getProductList(req, res) {
    var category = req.query.category;
    var page = parseInt(req.query.page) || 0;
    var size = parseInt(req.query.size) || 30;
    var condition = category ? {category : category} : null;

    Product.model.model.find(condition).skip(page * size).limit(size).exec(function (err, items) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(items);
    })
}

/**
 * 获取数量 目前的条件只有category 没有其他查询条件
 */
function getProductCount(req, res) {
    var category = req.query.category;
    var condition = {};
    if (category) condition.category = category;

    Product.model.model.count(condition, function (err, count) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(count);
    });
}

/**
 * 删除指定id的post
 */
function deleteById(req, res, next) {
    if (req.method.toLowerCase() === 'delete') {
        var body = req.body;

        if (!body._id) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '_id不允许为空');
        Product.model.model.findByIdAndRemove(body._id, function (err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (!item) return res.errorJson(result.TARGET_NOT_EXIT_ERROR_CODE, '该id不存在');
            res.rightJson();
        })
    }
    else  next();

}