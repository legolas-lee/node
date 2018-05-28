/**
 * Created by kreta on 2018/5/23.
 */
//超级管理-栏目管理
angular.module('myApp').controller('manageSuperColumn',function ($scope) {
    $scope.$emit('navState', {parrent:'manageSuper',current:'manageSuperColumn'});
})