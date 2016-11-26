angular.module('myApp', [
    'ngRoute',
    'myApp.createPost',
    'myApp.postlist'

]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
    //                    .when('/', {template: '首页'})
    //                    .when('/photo', {template: '图片库'})
    //                    .when('/product', {template: '产品'})
        //.otherwise({redirectTo: '/'});
}]).controller('rootCtrl', function ($scope, $http) {

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

});