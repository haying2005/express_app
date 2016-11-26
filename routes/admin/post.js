/**
 * Created by fangwenyu on 2016/11/20.
 */

//var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Post = require('../../models/Post');
var Category = require('../../models/Category');
var result = require('../return-result');

// var cookieParser = require('cookie-parser');
// var expressSsession = require('express-session');

router.post('/', createPost);
router.get('/', getPostList);
router.get('/:id', getPostById);
router.use('/', modifyById, deleteById);

router.get('/count', getPostCount);
module.exports = router;


/*
创建文章
 */
function createPost(req, res) {
    var body = req.body;

    if (!body.category || body.category.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'category不能为空');
    if (!body.title || body.title.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'title不能为空');
    if (!body.brief || body.brief.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'brief不能为空');
    if (!body.content || body.content.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'content不能为空');
    if (!req.session.userId) return res.errorJson(result.AUTH_ERROR_CODE, '用户身份验证失败,无法添加post');
    //检查categoryId 是否存在
    Category.model.model.findOne({_id : body.category}, function (err, item) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!item) return res.errorJson(result.BUSINESS_ERROR_CODE, 'Category不存在');
        post = new Post.model.model({
            title : body.title,
            by : req.session.userId,
            brief : body.brief,
            thumbnail : body.thumbnail,
            author : body.author,
            content : body.content,
            publish : body.publish,
            recommend : body.recommend,
            category : body.category
        });
        post.save(function (err) {
            if (err) res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            res.rightJson(post);
        });
    });

}

/**
 * 获取文章列表
 */
function getPostList(req, res) {
    var category = req.query.category;
    var page = parseInt(req.query.page) || 0;
    var size = parseInt(req.query.size) || 30;
    var condition = category ? {category : category} : null;

    Post.model.model.find(condition).skip(page * size).limit(size).exec(function (err, items) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(items);
    })
}

/**
 * 获取文章数量
 */
function getPostCount(req, res) {
    var root = parseInt(req.query.root);
    var category = req.query.category;
    var condition = {};
    if (category) condition.category = category;

    Post.model.model.count(condition, function (err, count) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(count);
    });
}
/**
 * 根据id查询文章
 */
function getPostById(req, res, next) {
    var id = req.params.id;
    if (id == 'count') return next('route');    //获取数目接口

    Post.model.model.findOne({_id : id}, function (err, item) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!item) return res.errorJson(result.TARGET_NOT_EXIT_ERROR_CODE, '该id不存在');
        res.rightJson(item);
    })
}

/**
 * 修改文章 创建者 点击次数  不能手动更新
 * todo:title brief等 需要做为空判断,不允许其为空 不能用!来判断,因为有可能没有传值
 */
function modifyById(req, res, next) {
    if (req.method.toLowerCase() === 'put'){

        var body = req.body;

        if (!body._id) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '_id不能为空');
        var update = {};
        if (body.category !== undefined) update.category = body.category;
        if (body.title !== undefined) update.title = body.title;
        if (body.author !== undefined) update.author = body.author;
        if (body.brief !== undefined) update.brief = body.brief;
        if (body.thumbnail !== undefined) update.thumbnail = body.thumbnail;
        if (body.content !== undefined) update.content = body.content;
        if (body.publish !== undefined) update.publish = body.publish;
        if (body.recommend !== undefined) update.recommend = body.recommend;
        if (body.category !== undefined) update.category = body.category;


        Post.model.model.findByIdAndUpdate({_id : body._id}, update, function (err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            res.rightJson();
        })
    }

    else next();

}

/**
 * 删除指定id的post
 */
function deleteById(req, res, next) {
    if (req.method.toLowerCase() === 'delete') {
        var body = req.body;

        if (!body._id) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, '_id不允许为空');
        Post.model.model.findByIdAndRemove(body._id, function (err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            if (!item) return res.errorJson(result.TARGET_NOT_EXIT_ERROR_CODE, '该id不存在');
            res.rightJson();
        })
    }
    else  next();

}