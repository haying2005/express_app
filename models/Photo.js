/**
 * Created by fangwenyu on 2016/11/17.
 */

var baseModel = require('./User.js');
var Model = baseModel.Model;
var mongoose = baseModel.mongoose;
var photoSchemea = new mongoose.Schema({
    path : {type : String, default : ''},
    name : String,
    hash : String,
    album : {type : String, default : 'default'},
    title : {type : String, default : ''},
    by : mongoose.Schema.Types.ObjectId //创建者id
},{
    versionKey: false,
    timestamps: true
});

var photoModel = new Model('Photo', photoSchemea);
module.exports.model = photoModel;