/**
 * Created by fangwenyu on 2016/11/21.
 */

var path = require('path');
var express = require('express');
var router = express.Router();
var Photo = require('../../models/Photo');
var Category = require('../../models/Category');
var result = require('../return-result');

var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '4XJ-j01TBq87-xR6B3r-IvXg0ufjZMtVlK9huB99';
qiniu.conf.SECRET_KEY = 'MRYDpuLlF2KI6IQKE1fpD22IRt9sbZWGkQw4tqBQ';

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads' });
var mime = require('mime');

router.post('/upload', upload.single('photo'), function (req, res, next) {
    //console.log(req.file);
    //res.rightJson(req.file);
    file = req.file;
    var domain = 'http://ogomt2558.bkt.clouddn.com';

    //要上传的空间
    bucket = 'fang-space';
    //上传到七牛后保存的文件名
    //key = file.filename;

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    function uptoken(bucket, key) {
        //var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        var putPolicy = new qiniu.rs.PutPolicy(bucket);
        //putPolicy.callbackUrl = 'http://your.domain.com/callback';
        //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
        return putPolicy.token();
    }

//生成上传 Token
    token = uptoken(bucket, key);

//要上传文件的本地路径
    filePath = file.path;

//构造上传函数
    function uploadFile(uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                fullpath = path.join(domain, ret.key);
                res.rightJson({path : fullpath});

            } else {
                // 上传失败， 处理返回代码
                console.log(err);
                res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err);
            }
        });
    }

//调用uploadFile上传
    uploadFile(token, key, filePath);
});

router.get('/qnToken', qiniuToken);

// router.post('/', createPost);
// router.get('/', getPostList);
// router.get('/:id', getPostById);
// router.use('/', modifyById, deleteById);
module.exports = router;


/*
    创建
 */
function createPhoto() {
    
}


/*
生产七牛upLoadToken
 */
function qiniuToken(req, res) {

    var domain = 'http://ogomt2558.bkt.clouddn.com';

    //要上传的空间
    bucket = 'fang-space';

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    function uptoken(bucket, key) {
        //var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        var putPolicy = new qiniu.rs.PutPolicy(bucket);
        //putPolicy.callbackUrl = 'http://your.domain.com/callback';
        //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
        return putPolicy.token();
    }

//生成上传 Token
    token = uptoken(bucket);

    res.rightJson({token : token});

}

