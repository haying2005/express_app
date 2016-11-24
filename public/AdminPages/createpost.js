/**
 * Created by fangwenyu on 2016/11/23.
 */

angular.module('myApp.createPost',['ngRoute'])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $routeProvider
            .when('/post', {
                templateUrl: './createpost.html',
                controller: 'createPostCtrl'
            })
            .when('/editpost', {
                templateUrl : './createpost.html',
                controller : 'editPostCtrl'
            })
    }])
    .controller('createPostCtrl', function ($scope, $http) {

        $scope.post = {};

        $scope.post.title = '';
        $scope.post.brief = '';
        $scope.post.thumbnail = '';
        $scope.post.content = '';
        $scope.post.publish = false;
        $scope.post.recommend = false;

        $scope.categorys = [];
        $scope.rt_categorys.map(function (x) {
            if (x.root == 1) {
                $scope.categorys.push(x);
            }
        });

        $scope.selectedCategory = $scope.categorys[0];
        $scope.post.author = $scope.rt_userInfo.Nick;

        $scope.submit = function () {
            
            $scope.post.category = $scope.selectedCategory._id;

            if (!$scope.post.title) return alert('请填写标题');
            if (!$scope.post.category) return alert('请选择分类');
            if (!$scope.post.brief) return alert('请填写摘要');
            if (!$scope.post.content) return alert('请填写正文');
            console.log($scope.post);

            $http.post('/admin/posts', $scope.post).success(function (response) {
                    if (response.code === 0) {
                        alert('发布成功');
                    }
                    else alert(response.description);
                }

            );
        }
    })
    .controller('editPostCtrl', function ($scope, $location,  $http) {

        // $scope.id;
        // $scope.post;
        // $scope.selectedCategory;

        if ($location.search().id) {
            $scope.id = $location.search().id;  //post id
            //初始化数据
            initDatas();
        }
        else {
            console.log('id为空');
        }

        $scope.submit = function () {

            $scope.post.category = $scope.selectedCategory._id;

            if (!$scope.post.title) return alert('请填写标题');
            if (!$scope.post.category) return alert('请选择分类');
            if (!$scope.post.brief) return alert('请填写摘要');
            if (!$scope.post.content) return alert('请填写正文');
            console.log($scope.post);

            $http.put('/admin/posts', $scope.post).success(function (response) {
                    if (response.code === 0) {
                        alert('修改成功');
                    }
                    else alert(response.description);
                }

            );
        };

        function initDatas() {
            fetchPost($scope.id);
        }

        function fetchPost(id) {
            $http.get('/admin/posts/' + id).success(function (response) {
                if (response.code == 0) {
                    console.log(response.data);
                    $scope.post = response.data;
                    $scope.selectedCategory = getSelectedCategory($scope.post.category);
                }
                else console.log(response.description);
            });
        }

        function getSelectedCategory(_id) {
            for (var i = 0; i < $scope.categorys.length; i ++) {
                if (_id == $scope.categorys[i]._id) {
                    return $scope.categorys[i];
                }
            }
        }
    });