/**
 * Created by kreta on 2018/5/23.
 */
//超级管理-角色管理
angular.module('myApp',['ngMaterial']).controller('manageSuperRole',function ($scope,$http,$mdDialog) {
    $scope.$emit('navState', {parrent:'manageSuper',current:'manageSuperRole'});
    function refreshList() {
        $http.get(transUrl('Accounts/getRoleList'),{params:{}})
            .then(function(res){
                $scope.roleList=res.data;
            },function (res) {
                console.log(res)
            })
    }
    refreshList();
    $scope.saveThis=function (item) {
        $http.post(transUrl('Accounts/updateRole'),item)
            .then(function(res){
                alert("角色更新成功")
                refreshList();
                console.log(res)
            },function (res) {
                console.log('服务器通信失败')
                console.log(res)
            })
    }
    //模态
    $scope.addRole=function () {
        //$scope.modelAddRole=true;
    }

    $scope.status = '  ';
    $scope.customFullscreen = false;
    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
            templateUrl: './view/manageSuper/dialog1.tmpl.html',
            parent: angular.element('.page-main'),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };
})