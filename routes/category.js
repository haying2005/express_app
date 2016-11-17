var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var result = require('./return-result');

router.use(result.resultMiddle);

router.get('/', function(req, res, next) {
    Category.model.getItems(0, 100, function (err, items) {
        if(err) {
            res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, '服务器内部错误');
        }
        else {
            res.rightJson(items);
        }

    })

});

router.get('/:id', function (req, res, next) {
    Category.model.getItemByID(req.params.id, function (err, items) {
        if(err)
            res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        else
            res.rightJson(items);
    })

});

router.post('/', function (req, res, next) {
    var name = req.body.name;
    var fatherId = req.body.fatherId;
    if(!name) {
        res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'name不能为空');
        return;
    }
    if (fatherId) {
        //查询fatherId是否存在
        Category.model.findOneById(fatherId, function(err, item) {
            if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);

            if (!item || item.count == 0) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'fatherId不存在');

            Category.model.createItem({name : name, fatherId : fatherId, childs : [], itemCount : 0}, function (err, items) {
                if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
                res.rightJson(items);
            })
        });
    }

});

router.put('/', function (req, res, next) {
    var id = req.body.id;
    var name = req.body.name;

    if (!id) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'id不能为空');
    if (!name) return res.errorJson(result.ILLEGAL_ARGUMENT_ERROR_CODE, 'name不能为空');
    //只能更新name, id fatherId都不能改
    Category.model.findOneByIdAndUpdate(id, {name : name}, function (err, item) {
        if (err) return res.errorJson(result.SERVER_EXCEPTION_ERROR_CODE, err.message);
        res.rightJson(item);
    })

});


module.exports = router;