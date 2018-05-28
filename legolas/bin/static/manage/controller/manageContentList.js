/**
 * Created by kreta on 2018/5/23.
 */
//内容管理-内容列表
angular.module('myApp').controller('manageContentList',function ($scope,$http) {
    $scope.$emit('navState', {parrent:'manageContent',current:'manageContentList'});
    function refreshList() {
        $http.get(transUrl('Content/getContentList'),{params:{}})
            .then(function(res){
                $scope.contentList=res.data;
            },function (res) {
                console.log(res)
            })
    }
    refreshList();
    $scope.toadd={star:'',title:'',title_extra:'',update_time:'',content_desc:'',outlink:'',content:'',author:'',view:'',likes:''}
    //添加内容
    $scope.addContent=function () {
        var formData=new FormData;
        var fileupload=document.querySelector("#pic").files[0];
        if(fileupload){
            formData.append('file',fileupload);
        }
        $scope.toadd.update_time= getCurrentTime();
        formData.append('data',JSON.stringify($scope.toadd))
        $http.post(transUrl('Content/addContent'),formData,{headers: {'Content-Type': undefined}})
            .then(function (res) {
                alert("添加成功")
                //$scope.toadd={star:'',title:'',title_extra:'',update_time:'',content_desc:'',outlink:'',content:'',author:'',view:'',likes:''}
                refreshList();
            },function (res) {
                console.log('服务器通信失败')
                console.log(res)
            })
    }
    //删除内容
    $scope.delContent=function (id) {
        $http.get(transUrl('Content/delContent'),{params:{"id":id}})
            .then(function (res) {
                alert("删除成功");
                refreshList();
            },function (res) {
                alert("删除失败")
            })
    }
    //获取内容详情
    $scope.getContentDetail=function (id) {
        $http.get(transUrl('Content/getContentDetail'),{params:{id:id}})
            .then(
                function (data) {
                    $scope.contentDetail=data.data[0];
                }
            )
    }
    //更新内容
    $scope.updateContent=function (id) {
        var formData=new FormData;
        var fileupload=document.querySelector("#picToUpload").files[0];
        if(fileupload){
            formData.append('file',fileupload);
        }
        $scope.contentDetail.update_time= getCurrentTime();
            formData.append('data',JSON.stringify($scope.contentDetail))
        $http.post(transUrl('Content/updateContent'),formData,{headers: {'Content-Type': undefined}})
            .then(function (res) {
                alert("更新成功")
                //$scope.toadd={star:'',title:'',title_extra:'',update_time:'',content_desc:'',outlink:'',content:'',author:'',view:'',likes:''}
                refreshList();
            },function (res) {
                console.log('服务器通信失败')
                console.log(res)
            })
    }
})