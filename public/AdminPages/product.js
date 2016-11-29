/**
 * Created by fangwenyu on 2016/11/28.
 */

angular.module('myApp.product', ['ngRoute', 'angularFileUpload', 'summernote']).
    config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider.
    when('/product', {
            templateUrl: './product.html',
            controller: 'productCtrl'
        }).
    when('/editproduct', {
            templateUrl : './product.html',
            controller : 'productCtrl'
        })

}]).
    controller('productCtrl', function ($scope, $http, FileUploader, $location) {
        $scope.path = $location.path();
    var isEdit = ($scope.path == '/editproduct');
    var id = $location.search().id;


    $scope.getCategorys(function (items) {
        if (items) {
            $scope.categorys = items.filter(function (x) {
                return x.root == 2;
            });
            $scope.selectedCategory = $scope.categorys[0];
        }
    });

    $scope.product = {};
    $scope.product.pics = [];

    if (isEdit) {
        function getSelectedCategory(_id) {
            for (var i = 0; i < $scope.categorys.length; i ++) {
                if (_id == $scope.categorys[i]._id) {
                    return $scope.categorys[i];
                }
            }
        }
        console.log('get product');
        $http.get('/admin/products/' + id).success(function (response) {
            if (response.code == 0) {
                $scope.product = response.data;
                $scope.selectedCategory = getSelectedCategory($scope.product.category);

            }
            else {
                alert(response.description);
            }
        })
    }

    //===========================>
    //angular-file-upload begin

    //获取新的七牛token
    $http.get('/admin/photos/qnToken').success(function (data) {
        if (data.code) {
            console.log(data.description);
        }
        $scope.token = data.uptoken;   //获取你的七牛uptoken
        $scope.prefix = data.domain;	//获取你的七牛文件存储地址
        $scope.uploader.formData.push({token : $scope.token});//token要在upload方法执行前加入到formData 否则无效
        $scope.uploader1.formData.push({token : $scope.token});//token要在upload方法执行前加入到formData 否则无效

    });

    //文章缩略图uploader
    $scope.uploader = $scope.createUploader(100);

    $scope.uploader.onAfterAddingFile = function(fileItem) {
        $scope.uploader.uploadItem(fileItem);
    };

    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);

        $scope.product.thumbnail = $scope.prefix + '/' + response.key;
        $scope.uploader.removeFromQueue(fileItem); //从列队里删除

        //将文件信息提交到服务器存档
        var photo = {};
        photo.name = response.key;
        photo.hash = response.hash;
        photo.path = $scope.prefix + '/' + response.key;
        photo.album = '产品相册';
        $http.post('/admin/photos', photo).success(function (response) {
            console.log(response.description);
        });
    };

    //产品图片uploader
    $scope.uploader1 = $scope.createUploader(100);

    $scope.uploader1.onAfterAddingFile = function(fileItem) {
        $scope.uploader1.uploadItem(fileItem);
    };

    $scope.uploader1.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        // $scope.pics.push({url : $scope.prefix + '/' + response.key});
        var url = $scope.prefix + '/' + response.key;
        for (var i = 0; i < $scope.product.pics.length; i ++) {
            if ($scope.product.pics[i] == url) {
                //不能有重复图片
                $scope.uploader1.removeFromQueue(fileItem);
                return;
            }
        }
        $scope.product.pics.push($scope.prefix + '/' + response.key);
        $scope.uploader1.removeFromQueue(fileItem); //从列队里删除,否则再添加文件就会失败 因为限制了queueLimit=1

        //将文件信息提交到服务器存档
        var photo = {};
        photo.name = response.key;
        photo.hash = response.hash;
        photo.path = $scope.prefix + '/' + response.key;
        photo.album = '产品相册';
        $http.post('/admin/photos', photo).success(function (response) {
            console.log(response.description);
        });
    };

    //angular-file-upload end
    //===================>

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

    $scope.submit = function () {

        $scope.product.category = $scope.selectedCategory._id;

        if (!$scope.product.title) return alert('请填写标题');
        if (!$scope.product.category) return alert('请选择分类');
        if (!$scope.product.brief) return alert('请填写摘要');
        if (!$scope.product.content) return alert('请填写正文');
        //if (!$scope.product.pics.length) return alert('请上传产品图片');
        console.log($scope.product);


        if (isEdit) {
            $http.put('/admin/products', $scope.product).success(function (response) {
                if (response.code == 0) {
                    alert('修改成功!');
                }
                else {
                    alert(response.description);
                }
            });
        }
        else {

            $http.post('/admin/products', $scope.product).success(function (response) {
                    if (response.code === 0) {
                        alert('发布成功');
                    }
                    else alert(response.description);
                }

            );
        }

    }

});