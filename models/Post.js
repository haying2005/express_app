/**
 * Created by fangwenyu on 2016/11/20.
 */

var baseModel = require('./User.js');
var Model = baseModel.Model;
var mongoose = baseModel.mongoose;
var postSchemea = new mongoose.Schema({

    category : mongoose.Schema.Types.ObjectId,    //分类id
    title : {type : String, default : ''},
    by : mongoose.Schema.Types.ObjectId,    //创建者id
    author : {type : String, default : ''}, //作者
    brief : {type : String, default : ''},
    thumbnail : String,    //缩略图url
    content : {type : String, default : ''},    //正文内容
    publish : {type : Boolean, default : 0},   //是否发布
    recommend : {type : Boolean, default : 0},   //是否推荐
    click : {type : Number, default : 0}

},{
    versionKey: false,
    timestamps: true
});

var postModel = new Model('Post', postSchemea);
module.exports.model = postModel;