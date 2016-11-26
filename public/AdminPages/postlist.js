/**
 * Created by fangwenyu on 2016/11/23.
 */

angular.module('myApp.postlist', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/postlist', {
            templateUrl: './postlist.html',
            controller: 'postlistCtrl'
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
controller('postlistCtrl', function ($scope, $http, $location, fields){


    $scope.fields = fields; //要显示的字段

    $scope.page = $location.search().page ? $location.search().page : 0;    //当前页
    $scope.size = $location.search().size ? $location.search().size : 10;    //每页显示数量

    $scope.posts = [];  //显示的post数据

    $scope.getCategorys(function (items) {
        if (items) {
            $scope.categorys = $scope.rt_categorys;  //所有类目,用来做categoryId与categoryName的映射
        }
    });
    $scope.itemCount = 0;   //总条目数
    $scope.pageCount = 0;   //总页数
    $scope.pages = [];

    $scope.toPage = function (page) {
        if (page == $scope.page) return;
        if (page < 0) return;
        if (page > $scope.pageCount - 1) return;
      setPage(page);
    };

    //初始化 参数为每页显示条数, 当前页编号
    intiWithSize($scope.size, $scope.page);

    function setPage(page) {
        $scope.page = page;
        $http.get('/admin/posts?page=' + $scope.page + '&&size=' + $scope.size).success(function (response) {
            console.log(response);
            if (response.code === 0) {
                var data = response.data;
                //预处理
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
                //预处理后的值付给posts
                $scope.posts = data;
            }
            else  {
                alert(response.description);
            }
        });
    }
    function intiWithSize(pageSize, page) {
        $scope.size = pageSize;
        //step1 获取所有post下的category
        //setp2 获取总条数
        $http.get('/admin/posts/count').success(function (response) {
            if (response.code == 0) {
                $scope.itemCount = parseInt(response.data);
                $scope.pageCount = Math.ceil($scope.itemCount / $scope.size);
                for (var i = 0; i < $scope.pageCount; i ++) {
                    $scope.pages.push(i);
                }
                //step3 获取实际的数据
                setPage(page);
            }
            else console.log(response.description);
        });
    }

});