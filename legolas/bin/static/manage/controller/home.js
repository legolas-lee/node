/**
 * Created by kreta on 2018/5/23.
 */
//首页
angular.module('myApp').controller('home',function ($scope,$http) {
    $scope.$emit('navState', {parrent:'home',current:'home'});
})