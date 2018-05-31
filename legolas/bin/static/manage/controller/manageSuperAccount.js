/**
 * Created by kreta on 2018/5/23.
 */
//超级管理-账号管理
angular.module('myApp').controller('manageSuperAccount',function ($scope,$http) {
    $scope.$emit('navState', {parrent:'manageSuper',current:'manageSuperAccount'});
    //获取账号列表
    function refreshList() {
        var dataToSend={params:{}}
        $http.get(transUrl('Accounts/getAccountsList'),dataToSend)
            .then(function(res){
                $scope.listData=res.data;
            },function (res) {
                console.log('服务器通信失败')
                console.log(res)
            })
    }
    refreshList();
    //添加账号
    $scope.dataToAdd={avatar:'',username:'',password:'',privilege:'',realname:'',sex:'',bithday:'',tel:'',email:'',qq:'',wechat:'',address:'',homepage:''}
    $scope.addAccount=function () {
        var fileupload=document.querySelector("#avatar").files[0];
        var formData=new FormData();
        formData.append('file',fileupload);
        formData.append('data',JSON.stringify($scope.dataToAdd));

        if($scope.dataToAdd.username==null){
            alert("用户名不能为空")
        }
        else{
            $http.post(transUrl('Accounts/addAccount'),formData,{headers: {'Content-Type': undefined}})
                .then(function (res) {
                    alert("添加成功")
                    $scope.dataToAdd={avatar:'',username:'',password:'',privilege:'',realname:'',sex:'',bithday:'',tel:'',email:'',qq:'',wechat:'',address:'',homepage:''}
                    refreshList();
                },function (res) {
                    console.log('服务器通信失败')
                    console.log(res)
                })
        }
    }
    //删除账号
    $scope.delAccount=function(id){
        var dataToSend={params:{'id':id}}
        $http.get(transUrl('Accounts/delAccount'),dataToSend)
            .then(function (res) {
                alert("删除成功")
                refreshList();
            },function (res) {
                console.log('服务器通信失败')
                console.log(res)
            })
    }
    //查询账号信息
    $scope.queryAccount=function (id) {
        var dataToSend = {params: {"ID":id}}
        $http.get(transUrl('Accounts/getAccountInfo'), dataToSend)
            .then(function (res) {
                $scope.currentData = res.data[0];
                $scope.moduleOpen('updateAccount',80)
                console.log($scope.currentData)
            }, function (res) {
                console.log('服务器通信失败')
                console.log(res)
            })
    }
    //更新账号信息
    $scope.updateAccount=function (id) {
        var formData=new FormData();
        if(document.querySelector("#resetAvatar").files.length>0){
            var fileupload=document.querySelector("#resetAvatar").files[0];
            formData.append('file',fileupload);
        }
        formData.append('data',JSON.stringify($scope.currentData));
        $http.post(transUrl('Accounts/updateAccount'),formData,{headers: {'Content-Type': undefined}})
            .then(function (res) {
                alert("修改成功");
                $scope.moduleClose('updateAccount');
                refreshList();
            },function (res) {
                console.log(res)
            })
    }
})