/**
 * Created by kreta on 2018/5/23.
 */
//超级管理-数据库操作
angular.module('myApp').controller('manageSuperDatabase',function ($scope) {
    $scope.$emit('navState', {parrent:'manageSuper',current:'manageSuperDatabase'});
})