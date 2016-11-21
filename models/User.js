/**
 * 连接数据库
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function () {
    console.log('mongoose connect success!');
});

var userScheme = new mongoose.Schema({
    LoginName : String,  //用户名
    Password : String, //登录密码
    Nick : String, //昵称
    HeadUrl : {type : String, default : ''},  //头像
    Rights : {type : Number, default : 0},
    LastLoginTime : Date, //最后登录时间
    Ip : {type : String, default : '0.0.0.0'},
    Mobile : String,
    Email : String
},{
    versionKey: false,
    timestamps: true
});


//
function Model(collectionName, schema) {
    this.schema = schema;
    this.collectionName = collectionName;
    this.model = mongoose.model(collectionName, schema, collectionName);    //指定数据库表名为collectionName
}

Model.prototype.getItems = function (page, size, callback) {
    // page = parseInt(page);
    // size = parseInt(size);

    var that = this;
    this.model.find(function (err, items) {
        if (err) {
            callback(err, null);
        }
        else {
            //console.log('get items from '  + that.collectionName + ': ' + items);
            callback(null, items);
        }

    });

};
Model.prototype.getItemByID = function (id, callback) {
    var that = this;
    this.model.findById(id, function (err, items) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, items);
        }
    })
};

Model.prototype.findOneById = function (id, callback) {
    var that = this;
    this.model.findOne({_id : id}, function (err, item) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, item);
        }
    })
};

Model.prototype.createItem = function (object, callback) {
    var obj = new this.model(object);
    obj.save(function (err, obj) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, obj);
        }
    });
};

Model.prototype.findOneByIdAndUpdate = function (id, obj, callback) {
   this.model.findOneAndUpdate({_id : id}, obj, function (err, item) {
       if (err) callback(err, null);
       else  callback(null, item);
   })
};

var userModel = new Model('Users', userScheme);
module.exports.Model = Model;   //封装一些通用的数据库查询等方法
module.exports.model = userModel;
module.exports.mongoose = mongoose;