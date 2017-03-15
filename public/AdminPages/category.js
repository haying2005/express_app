/**
 * Created by fangwenyu on 2016/12/14.
 */
angular.module('myApp.category', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/category', {
            templateUrl: './category.html',
            controller: 'categoryCtrl'
        });
    }]).
value('fields', {
    //数据库原始字段
    categoryName : '分类',    //分类name
    title : '标题',
    //by : '创建者',    //创建者id
    author : '作者', //作者
    //brief : '摘要',
    //thumbnail : '缩略图',    //缩略图url
    //content : '正文内容',    //正文内容
    click : '点击数',

    //自定义字段
    publishState : '发布',   //是否发布
    recommendState : '推荐'   //是否推荐

}).
controller('categoryCtrl', function ($scope, $http, $location, fields){


    //$scope.categorys = [];
    $scope.roots = [];
    $scope.reloadCategorys(function (categorys_) {

        function getChilds(category, categoryArr) {
            category.childs = [];
            for (var i = 0; i < categoryArr.length; i++) {
                if (category._id == categoryArr[i].fatherId) {
                    category.childs.push(categoryArr[i]);
                }
            }
        }

        categorys_.map(function (item) {

            getChilds(item, categorys_);

            var hasExist = false;   //if root is exist

            for (var i = 0; i < $scope.roots.length; i ++) {
               if (item.root == $scope.roots[i].index) {
                   hasExist = true;
                   $scope.roots[i].childs.push(item);
                   break;
               }
            }
            if (!hasExist) {
                //console.log(item.root + '...');
                var root_ = {};
                root_.childs = [];
                root_.index = item.root;
                root_.childs.push(item);

                if (root_.index == 1) {
                    root_.name = '文章类目';
                    $scope.roots.push(root_);
                }
                else if (root_.index == 2) {
                    root_.name = '产品类目';
                    $scope.roots.push(root_);
                }
                else if (root_.index == 3) {
                    root_.name = '图片类目';
                    $scope.roots.push(root_);
                }
                else {
                }
            }
        });

        console.log(categorys_);
        console.log($scope.roots);

    });




});