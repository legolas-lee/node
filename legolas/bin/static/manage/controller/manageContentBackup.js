/**
 * Created by kreta on 2018/5/23.
 */
//内容管理-回收站
angular.module('myApp').controller('manageContentBackup',function ($scope) {
    $scope.$emit('navState', {parrent:'manageContent',current:'manageContentBackup'});
})