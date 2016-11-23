/**
 * Created by fangwenyu on 2016/11/23.
 */

angular.module('myApp.createPost',['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/post', {
            templateUrl: './createpost.html',
            controller: 'createPostCtrl'
        });
    }])
    .controller('createPostCtrl', function ($scope, $http) {

        $scope.post = {};

        $scope.post.title = '';
        $scope.post.brief = '';
        $scope.post.thumbnail = '';
        $scope.post.content = '';
        $scope.post.publish = 0;
        $scope.post.recommend = 0;

        $scope.selectedCategory;



        $http.get("/admin/categorys?root=1")
            .success(function (response) {
                if (response.code === 0) {
                    console.log(response.data);
                    $scope.categorys = response.data;
                    $scope.selectedCategory = $scope.categorys[0];
                    $scope.post.author = response.userInfo.nick;

                    $scope.post.category = $scope.selectedCategory._id;

                }
                else console.log(response);
            });
        $scope.submit = function () {
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
    });