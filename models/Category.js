
var baseModel = require('./User.js');
var Model = baseModel.Model;
var mongoose = baseModel.mongoose;
var categorySchemea = new mongoose.Schema({
    name : String, //根分类写死：文章 图片 产品 询价 公司信息(联系我们，关于我们)
    fatherId : mongoose.Schema.Types.ObjectId,
    childs : Array,
    itemCount : {type : Number, default : 0}
},{
    versionKey: false,
    timestamps: true
});

var categoryModel = new Model('Category', categorySchemea);
module.exports.model = categoryModel;
