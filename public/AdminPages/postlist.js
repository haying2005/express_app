/**
 * Created by fangwenyu on 2016/11/23.
 */

angular.module('myApp.postlist', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/postlist', {
            templateUrl: './postlist.html',
            controller: 'postlistCtrl'
        });
}]).
value('fields', {
    categoryName : '分类',    //分类name
    title : '标题',
    //by : '创建者',    //创建者id
    author : '作者', //作者
    //brief : '摘要',
    //thumbnail : '缩略图',    //缩略图url
    //content : '正文内容',    //正文内容
    publishState : '发布',   //是否发布
    recommendState : '推荐',   //是否推荐
    click : '点击数'

}).
controller('postlistCtrl', function ($scope, $http, fields){
    $scope.fields = fields;
    $scope.page = 0;
    $scope.size = 1;
    $scope.posts = [];
    $scope.categorys = [];
    $scope.itemCount = 0;   //总条目数

    $scope.pageCount = 0;
    $scope.pages = [];

    //获取所有文章分类
    $http.get("/admin/categorys?root=1")
        .success(function (response) {
            if (response.code === 0) {
                console.log(response.data);
                $scope.categorys = response.data;

                $http.get('/admin/posts?page=' + $scope.page + '&&size=' + $scope.size).success(function (response) {
                    console.log(response);
                    if (response.code === 0) {
                        $scope.itemCount = response.data.count;
                        $scope.pageCount = Math.ceil($scope.itemCount / $scope.size);
                        for (var i = 0; i < $scope.pageCount; i ++) {
                            $scope.pages.push(i);
                        }
                        var data = response.data.items;
                        //console.log(data);
                        //return;
                        data.map(function (x) {
                           for (var i = 0; i < $scope.categorys.length; i ++) {
                               if ($scope.categorys[i]._id == x.category) {
                                   x.categoryName = $scope.categorys[i].name;
                                   break;
                               }
                           }
                           x.recommendState = x.recommend ? '是' : '否';
                            x.publishState = x.publish ? '是' : '否'

                        });
                        $scope.posts = data;
                    }
                    else  {
                        alert(response.description);
                    }
                });

            }
            else {
                console.log(response);
                alert(response.description);
            }
        });


});