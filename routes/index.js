var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });


  res.type('text/html').send('<form action="/photos/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="photo" multiple="multiple"><br>'+
      '<input type="submit" value="上传">'+
      '</form>');
});

module.exports = router;
