
function Result(code, description, data) {
    this.code = code || 0;
    this.description = description || '';
    this.data = data;
}


//中间件
var resultMiddle = function (req, res, next) {
    res.errorJson = function (code, msg) {
        var result_ = new Result(code, msg, undefined);
        //result_.userInfo = req.userInfo;//用户基本信息附加到返回里
        res.json(result_);
    };

    res.rightJson = function (data) {
        var result_ = new Result(0, 'ok', data);
        //result_.userInfo = req.userInfo;//用户基本信息附加到返回里
        res.json(result_);
    };
    next();
};
// var adminResultMiddle = function (req, res, next) {
//     res.errorJson = function (code, msg, admin) {
//         var result_ = new Result(code, msg, undefined);
//         result_.admin = admin;
//         res.json(result_);
//     };
//
//     res.rightJson = function (data) {
//         var result_ = new Result(0, 'ok', data);
//         result_.admin = admin;
//         res.json(result_);
//     };
//     next();
// };

var RestResult = function(){
    this.errorCode = RestResult.NO_ERROR ;
    this.returnValue = {};
    this.errorReason = "";
};



// RestResult.NO_ERROR = 0;//无错误
// RestResult.ILLEGAL_ARGUMENT_ERROR_CODE = 1;//无效参数错误
// RestResult.BUSINESS_ERROR_CODE = 2;//业务错误
// RestResult.AUTH_ERROR_CODE = 3;//认证错误
// RestResult.SERVER_EXCEPTION_ERROR_CODE = 5;//服务器未知错误
// RestResult.TARGET_NOT_EXIT_ERROR_CODE = 6;//目标不存在错误

module.exports = {
    resultMiddle : resultMiddle,
    //adminResultMiddle : adminResultMiddle,
    NO_ERROR : 0,
    ILLEGAL_ARGUMENT_ERROR_CODE : 1,
    BUSINESS_ERROR_CODE : 2,
    AUTH_ERROR_CODE : 3,
    SERVER_EXCEPTION_ERROR_CODE : 4,
    TARGET_NOT_EXIT_ERROR_CODE : 5

};