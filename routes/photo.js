/**
 * Created by fangwenyu on 2016/11/17.
 */

var express = require('express');
var router = express.Router();
var Photo = require('../models/Photo');

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads' });
var mime = require('mime');


router.get('/', function(req, res, next) {
    res.rightJson('get all the photos...')
});

router.get('/:id', function (req, res, next) {
    res.rightJson('get photo by id: ' + req.params.id);
});

router.post('/upload', upload.single('photo'), function (req, res, next) {

    res.rightJson(req.file);
});

router.put('/', function (req, res, next) {

});


module.exports = router;