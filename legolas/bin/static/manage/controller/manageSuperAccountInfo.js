/**
 * Created by kreta on 2018/5/23.
 */
angular.module('myApp').controller('manageSuperAccountInfo',function ($scope,$http,$stateParams) {
    $scope.$emit('navState', {parrent: 'manageSuper', current: 'manageSuperAccountInfo'});
    //获取个人信息
    var dataToSend = {params: {"ID": $stateParams.id}}
    $http.get(transUrl('Accounts/getAccountInfo'), dataToSend)
        .then(function (res) {
            $scope.adminData = res.data[0];
        }, function (res) {
            console.log('服务器通信失败')
            console.log(res)
        })
})