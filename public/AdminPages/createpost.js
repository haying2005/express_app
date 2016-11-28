/**
 * Created by fangwenyu on 2016/11/23.
 */

angular.module('myApp.createPost',['ngRoute', 'angularFileUpload', 'summernote'])
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
    .controller('createPostCtrl', function ($scope, $http, FileUploader) {

        //===========================>
        //summernote-angular begin
        $scope.options = {
            height: 300

        };

        $scope.init = function() { console.log('Summernote is launched'); };
        $scope.enter = function() { console.log('Enter/Return key pressed'); };
        $scope.focus = function(e) { console.log('Editable area is focused'); };
        $scope.blur = function(e) { console.log('Editable area loses focus'); };
        $scope.paste = function(e) {
            console.log('Called event paste: ' +  e.originalEvent.clipboardData.getData('text'));
        };
        $scope.change = function(contents) {
            console.log('contents are changed:', contents, $scope.editable);
        };
        $scope.keyup = function(e) { console.log('Key is released:', e.keyCode); };
        $scope.keydown = function(e) { console.log('Key is pressed:', e.keyCode); };
        $scope.imageUpload = function(files) {
            console.log('image upload:', files);
            console.log('image upload\'s editor:', $scope.editor);
            console.log('image upload\'s editable:', $scope.editable);
        };
        //summernote-angular end
        //===================>

        //===========================>
        //angular-file-upload begin

        //获取新的七牛token
        $http.get('/admin/photos/qnToken').success(function (data) {
            $scope.token = data.uptoken;   //获取你的七牛uptoken
            $scope.prefix = data.domain;	//获取你的七牛文件存储地址
            $scope.uploader.formData.push({token : $scope.token});

        });

        //文章缩略图uploader
        $scope.uploader = $scope.createUploader(100);

        $scope.uploader.onAfterAddingFile = function(fileItem) {
            $scope.uploader.uploadItem(fileItem);
        };

        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            // $scope.pics.push({url : $scope.prefix + '/' + response.key});

            $scope.post.thumbnail = $scope.prefix + '/' + response.key;
            $scope.uploader.removeFromQueue(fileItem); //

            //将文件信息提交到服务器存档
            var photo = {};
            photo.name = response.key;
            photo.hash = response.hash;
            photo.path = $scope.prefix + '/' + response.key;
            photo.album = '文章相册';
            $http.post('/admin/photos', photo).success(function (response) {
                console.log(response);
            });
        };

        //angular-file-upload end
        //===================>

        $scope.post = {};

        $scope.post.title = '';
        $scope.post.brief = '';
        $scope.post.thumbnail = '';
        $scope.post.content = '';
        $scope.post.publish = false;
        $scope.post.recommend = false;


        $scope.getCategorys(function (items) {
            if (items) {
                $scope.categorys = items.filter(function (x) {
                    return x.root == 1;
                });
                $scope.selectedCategory = $scope.categorys[0];
            }
        });

        $scope.getUserInfo(function (user) {
            if (user) {
                $scope.post.author = user.Nick;
            }
        });

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
        };


    })
    .controller('editPostCtrl', function ($scope, $location,  $http) {

        //===========================>
        //summernote-angular begin
        $scope.options = {
            height: 300

        };

        $scope.init = function() { console.log('Summernote is launched'); };
        $scope.enter = function() { console.log('Enter/Return key pressed'); };
        $scope.focus = function(e) { console.log('Editable area is focused'); };
        $scope.blur = function(e) { console.log('Editable area loses focus'); };
        $scope.paste = function(e) {
            console.log('Called event paste: ' +  e.originalEvent.clipboardData.getData('text'));
        };
        $scope.change = function(contents) {
            console.log('contents are changed:', contents, $scope.editable);
        };
        $scope.keyup = function(e) { console.log('Key is released:', e.keyCode); };
        $scope.keydown = function(e) { console.log('Key is pressed:', e.keyCode); };
        $scope.imageUpload = function(files) {
            console.log('image upload:', files);
            console.log('image upload\'s editor:', $scope.editor);
            console.log('image upload\'s editable:', $scope.editable);
        };
        //summernote-angular end
        //===================>

        //===========================>
        //angular-file-upload begin

        //获取新的七牛token
        $http.get('/admin/photos/qnToken').success(function (data) {
            $scope.token = data.uptoken;   //获取你的七牛uptoken
            $scope.prefix = data.domain;	//获取你的七牛文件存储地址
            $scope.uploader.formData.push({token : $scope.token});

        });

        //文章缩略图uploader
        $scope.uploader = $scope.createUploader(100);

        $scope.uploader.onAfterAddingFile = function(fileItem) {
            $scope.uploader.uploadItem(fileItem);
        };

        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            // $scope.pics.push({url : $scope.prefix + '/' + response.key});

            $scope.post.thumbnail = $scope.prefix + '/' + response.key;
            $scope.uploader.removeFromQueue(fileItem); //从列队里删除

            //将文件信息提交到服务器存档
            var photo = {};
            photo.name = response.key;
            photo.hash = response.hash;
            photo.path = $scope.prefix + '/' + response.key;
            photo.album = '文章相册';
            $http.post('/admin/photos', photo).success(function (response) {
                console.log(response);
            });
        };


        //angular-file-upload end
        //===================>

        $scope.getCategorys(function (items) {
            if (items) {
                $scope.categorys = items.filter(function (x) {
                    return x.root == 1;
                });
            }
        });

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

