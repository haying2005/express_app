/**
 * Created by fangwenyu on 2016/11/20.
 */

//var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Post = require('../../models/Post');
var Category = require('../../models/Category');
var result = require('../return-result');

var cookieParser = require('cookie-parser');
var expressSsession = require('express-session');

router.post('/', createPost);
router.get('/', getPostList);
module.exports = router;


// category : mongoose.Schema.Types.ObjectId,    //分类id
//     title : {type : String, default : ''},
// by : mongoose.Schema.Types.ObjectId,
//     brief : {type : String, default : ''},
// thumbnail : mongoose.Schema.Types.ObjectId,    //缩略图ID 缩略图只能从图库取,所以设置为ID类型
//     content : {type : String, default : ''},    //正文内容
// publish : {type : Boolean, default : 0},   //是否发布
// recommend : {type : Boolean, default : 0},   //是否推荐
// updateTime : {type : Date, default : new Date()},   //最后更新时间
// click : {type : Number, default : 0}


/*
创建文章
 */
function createPost(req, res) {
    var body = req.body;

    if (!body.category || body.category.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'category不能为空');
    if (!body.title || body.title.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'title不能为空');
    if (!body.brief || body.brief.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'brief不能为空');
    if (!body.content || body.content.length === 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'content不能为空');
    if (!req.session.userId) return res.errorJson(result.AUTH_ERROR_CODE, '用户身份验证失败');
    //检查categoryId 是否存在
    Category.model.model.findOne({_id : body.category}, function (err, item) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        if (!item) return res.errorJson(result.BUSINESS_ERROR_CODE, 'Category不存在');
        post = new Post.model.model({
            title : body.title,
            by : req.session.userId,
            brief : body.brief,
            thumbnail : body.thumbnail,
            content : body.content,
            publish : body.publish,
            recommend : body.recommend
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
    var size = parseInt(req.query.size) || 3;
    var condition = category ? {category : category} : null;

    Post.model.model.find(condition)
        .skip(page * size)
        .limit(size)
        .exec(function (err, items) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
            res.rightJson(items);
        })
}
