angular.module('myApp', [
    'ngRoute',
    'myApp.createPost',
    'myApp.postlist',
    'myApp.product',
    'angularFileUpload'

]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    //$routeProvider
    //                    .when('/', {template: '首页'})
    //                    .when('/photo', {template: '图片库'})
    //                    .when('/product', {template: '产品'})
        //.otherwise({redirectTo: '/'});
}]).controller('rootCtrl', function ($scope, $http, FileUploader) {

    $scope.getCategorys = function (callback) {
        if ($scope.rt_categorys) {
            return callback($scope.rt_categorys);
        }
        else {
            console.log('请求categorys....');
            $http.get('/admin/categorys').success(function (response) {
                if (response.code == 0) {
                    $scope.rt_categorys = response.data;
                    callback($scope.rt_categorys);
                }
                else {
                    callback(null);
                    console.log(response.description);
                }
            });
        }
    };


    $scope.getUserInfo = function (callback) {
        if ($scope.rt_userInfo) {
            console.log($scope.rt_userInfo);
            return callback($scope.rt_userInfo);
        }
        else  {
            $http.get('/admin/users/info').success(function (response) {
                if (response.code == 0) {
                    //$scope.rt_userInfo = response.data;
                    $scope.rt_userInfo = response.data;
                    callback($scope.rt_userInfo);
                    console.log(response);
                }

                else {
                    callback(null);
                    console.log(response.description);
                }
            });
        }

    };

    $scope.createUploader = function (limit) {
        var lim = limit || 1;
        var uploader = new FileUploader({
            url : 'http://upload.qiniu.com',
            queueLimit: lim   //文件个数
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            //console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            //console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

        return uploader;
    };

});