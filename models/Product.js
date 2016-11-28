/**
 * Created by fangwenyu on 2016/11/28.
 */

var baseModel = require('./User.js');
var Model = baseModel.Model;
var mongoose = baseModel.mongoose;
var productSchemea = new mongoose.Schema({

    category : mongoose.Schema.Types.ObjectId,    //分类id
    title : {type : String, default : ''},
    by : mongoose.Schema.Types.ObjectId,    //创建者id
    brief : {type : String, default : ''},
    thumbnail : String,    //缩略图url
    pics : Array,   //图片url数组
    content : {type : String, default : ''},    //正文内容
    publish : {type : Boolean, default : 0},   //是否发布
    recommend : {type : Boolean, default : 0},   //是否推荐
    click : {type : Number, default : 0},   //点击次数
    inquire : {type : Number, default : 0}  //询价次数

},{
    versionKey: false,
    timestamps: true
});

var productModel = new Model('Product', productSchemea);
module.exports.model = productModel;