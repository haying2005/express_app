
var baseModel = require('./User.js');
var Model = baseModel.Model;
var mongoose = baseModel.mongoose;
var categorySchemea = new mongoose.Schema({
    name : String,
    fatherId : mongoose.Schema.Types.ObjectId,  //可以为空 fatherid跟root 至少要有一样
    root : Number,   //属于哪个根分类 1.Post 2.Product 3.Photo
    priority : {type : Number, default : 0} //优先级
},{
    versionKey: false,
    timestamps: true
});

var categoryModel = new Model('Category', categorySchemea);
module.exports.model = categoryModel;
