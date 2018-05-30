/**
 * Created by kreta on 2018/5/23.
 */
//超级管理-角色管理
angular.module('myApp',['ionic']).controller('manageSuperRole',function ($scope,$http,$ionicModal) {
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

})