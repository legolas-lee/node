/**
 * Created by kreta on 2018/5/23.
 */
//服务器信息
angular.module('myApp').controller('manageExtraServer',function ($scope,$http) {
    $scope.$emit('navState', {parrent:'manageSuper',current:'manageExtraServer'});
    $http.get(transUrl('ExtraInfo/ServerInfo'),{params:{}})
        .then(function(res){
            $scope.serverData=res.data;
        },function (res) {
            console.log('服务器通信失败')
            console.log(res)
        })
})