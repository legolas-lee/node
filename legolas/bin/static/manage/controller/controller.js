/**
 * Created by kreta on 2018/5/19.
 */
var app=angular.module('myApp',['ui.router','oc.lazyLoad','ngMaterial']);
var release=false //false为内网访问，true为外网访问
function transUrl(url) {
    if(release){return 'http://kretaslee.asuscomm.com:3000/'+url;}
    else{return 'http://localhost:3000/'+url;}
}
function  getCurrentTime() {
    var date=new Date();
    return(date.getTime())
}
getCurrentTime();
app.directive('moduleBox', ['$timeout', function () {
    return{
        restrict: 'E',
        scope: false,
        link: function (scope,element,attr) {
            $(element).hide();
            $(document).on("click",function(e){
                if($(e.target).parents(".module-content-bg").length == 0&&$(e.target).hasClass("module-btn")==false){
                    $(element).hide();
                }
            });
            scope.moduleClose=function (id) {
                $('#'+id).hide()
            }
            scope.moduleOpen=function (id,width) {
                var moduleBox=$('#'+id);
                moduleBox.show();
                scope.moduleWidth=moduleBox.find(".module-content").width();
                scope.moduleHeight=moduleBox.find(".module-content").height();
                if(width){
                    if(width==100){
                        scope.boxStyle="left:0; top:0; margin:0; width:100%; height:100%"
                    }
                    else{
                        scope.boxStyle="left:"+(100-width)/2+"%; width:"+width+"%;top:50%; margin-top: -"+scope.moduleHeight/2+"px"
                    }
                }
                else{
                    scope.boxStyle="left:50%; margin-left: -"+parseInt(scope.moduleWidth)/2+"px; top:50%; margin-top: -"+scope.moduleHeight/2+"px";
                }
            }
        },
        transclude: true,
        template:
        '<div class="module-content-bg css-animate-slow fadeIn">' +
        '<div class="module-content padding" style={{boxStyle}}>' +
        '<div ng-transclude></div>' +
        '</div>' +
        '</div>'
    }
}]);
//路由设置
app.config(function ($stateProvider, $urlRouterProvider,$httpProvider,$locationProvider) {
    // $httpProvider.defaults.transformRequest = function(obj){
    //     var str = [];
    //     for(var p in obj) {
    //         str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    //     }
    //     return str.join("&");
    // };
    // $httpProvider.defaults.headers.post = {"Content-Type": "application/x-www-form-urlencoded"}
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        //服务器信息
        .state('manageExtraServer', {
            url: '/manageExtraServer',
            templateUrl: 'view/manageSuper/manageExtraServer.html',
            controller: 'manageExtraServer',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageExtraServer.js'
                    ]);
                }]
            }
        })
        //首页
        .state('home', {
            url: '/home',
            templateUrl: 'view/home/home.html',
            controller: 'home',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/home.js'
                    ]);
                }]
            }
        })
        //超级管理-栏目管理
        .state('manageSuperColumn', {
            url: '/manageSuperColumn',
            templateUrl: 'view/manageSuper/manageSuperColumn.html',
            controller: 'manageSuperColumn',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageSuperColumn.js'
                    ]);
                }]
            }
        })
        //超级管理-角色管理
        .state('manageSuperRole', {
            url: '/manageSuperRole',
            templateUrl: 'view/manageSuper/manageSuperRole.html',
            controller: 'manageSuperRole',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageSuperRole.js'
                    ]);
                }]
            }
        })
        //超级管理-账号管理
        .state('manageSuperAccount', {
            url: '/manageSuperAccount',
            templateUrl: 'view/manageSuper/manageSuperAccount.html',
            controller: 'manageSuperAccount',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageSuperAccount.js'
                    ]);
                }]
            }
        })
        //超级管理-数据库操作
        .state('manageSuperDatabase', {
            url: '/manageSuperDatabase',
            templateUrl: 'view/manageSuper/manageSuperDatabase.html',
            controller: 'manageSuperDatabase',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageSuperDatabase.js'
                    ]);
                }]
            }
        })
        //获取个人信息
        .state('manageSuperAccountInfo', {
            url: '/manageSuperAccountInfo?id',
            templateUrl: 'view/manageSuper/manageSuperAccountInfo.html',
            controller: 'manageSuperAccountInfo',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageSuperAccountInfo.js'
                    ]);
                }]
            }
        })
        //内容管理-内容列表
        .state('manageContentList', {
            url: '/manageContentList',
            templateUrl: 'view/manageContent/manageContentList.html',
            controller: 'manageContentList',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageContentList.js'
                    ]);
                }]
            }
        })
        //内容管理-回收站
        .state('manageContentBackup', {
            url: '/manageContentBackup',
            templateUrl: 'view/manageContent/manageContentBackup.html',
            controller: 'manageContentBackup',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'controller/manageContentBackup.js'
                    ]);
                }]
            }
        })
});
//父级模块
app.controller('parent',function($scope,$http,$window) {
    //Resize处理
    var w = angular.element($window);
    $scope.widowInfo={}
    function getWindowInfo() {
        $scope.widowInfo.width=$window.innerWidth;
        $scope.widowInfo.height=$window.innerHeight;
        $scope.widowInfo.scrolltTp=$window.scroll.scrollTop;
    }
    getWindowInfo();
    w.bind('resize', function(){
        getWindowInfo();
        console.log($scope.widowInfo)
    })
    //登录用户变量
    $scope.me={ID:0}
    //获取个人信息
    var dataToSend = {params: {"ID": $scope.me.ID}}
    $http.get(transUrl('Accounts/getAccountInfo'), dataToSend)
        .then(function (res) {
            $scope.me.data = res.data[0];
        }, function (res) {
            console.log('服务器通信失败')
            console.log(res)
        })
    //获取IP地址
    $scope.ipAddr=returnCitySN;
    //获取服务器信息
    $scope.memo={}
    $http.get(transUrl('ExtraInfo/ServerInfo'),{params:{}})
        .then(function(res){
            $scope.serverData=res.data;
            $scope.memo.free=res.data.data.freemem.value;
            $scope.memo.total=res.data.data.totalmem.value;
            $scope.memo.used=(res.data.data.freemem.extra/res.data.data.totalmem.extra*100).toFixed(2);
        },function (res) {
            console.log('服务器通信出错,获取服务器信息失败')
            console.log(res)
        })

    $scope.pageClass=['navOn','footbarOn','noticeOn','noticeWidth-normal','noticeBackground-dark']
    //模块状态变化
    $scope.togglePageClass=function(type,addOn){
        if(addOn){
            for(i=0;i<addOn.length;i++){
                for(var key in addOn[i]){
                    if(key=='width'){
                        $scope.pageClass[3]='noticeWidth-'+addOn[i][key]
                    }
                    else if(key=='background'){
                        $scope.pageClass[4]='noticeBackground-'+addOn[i][key]
                    }
                }
            }
        }
        switch(type){
            case 'nav':
                $scope.pageClass[0]=($scope.pageClass[0]=='navOn')? 'navOff': 'navOn';
                break;
            case 'footbar':
                $scope.pageClass[1]=($scope.pageClass[1]=='footbarOn')? 'footbarOff': 'footbarOn';
                break;
            case 'notice':
                $scope.pageClass[2]=($scope.pageClass[2]=='noticeOn')? 'noticeOff': 'noticeOn';
                break;
        }
    }
    //导航条数据
    $scope.navData={
        'data':[
            {
                text_name:'首页',
                text_name_extra:'',
                module_name:'home',
                parrent_module_name:'',
                describe:'',
                notice_total:0,
                icon:'fa fa-home',
                submenu:[]
            },
            {
                text_name:'超级管理',
                text_name_extra:'',
                module_name:'manageSuper',
                parrent_module_name:'',
                describe:'',
                notice_total:22,
                icon:'fa fa-user-secret',
                submenu:[
                    {
                        text_name:'栏目管理',
                        text_name_extra:'',
                        module_name:'manageSuperColumn',
                        parrent_module_name:'',
                        describe:'',
                        notice:2
                    },
                    {
                        text_name:'角色管理',
                        text_name_extra:'',
                        module_name:'manageSuperRole',
                        parrent_module_name:'',
                        describe:'Role',
                        notice:999
                    },
                    {
                        text_name:'账号管理',
                        text_name_extra:'',
                        module_name:'manageSuperAccount',
                        parrent_module_name:'',
                        describe:'',
                        notice:0
                    },
                    {
                        text_name:'数据库操作',
                        text_name_extra:'',
                        module_name:'manageSuperDatabase',
                        parrent_module_name:'',
                        describe:'',
                        notice:0
                    },
                    {
                        text_name:'服务器信息',
                        text_name_extra:'',
                        module_name:'manageExtraServer',
                        parrent_module_name:'',
                        describe:'',
                        notice:0
                    }
                ]
            },
            {
                text_name:'内容管理',
                text_name_extra:'',
                module_name:'manageContent',
                parrent_module_name:'',
                describe:'',
                notice_total:22,
                icon:'fa fa-file-alt',
                submenu:[
                    {
                        text_name:'内容列表',
                        text_name_extra:'',
                        module_name:'manageContentList',
                        parrent_module_name:'',
                        describe:'',
                        notice:0
                    },
                    {
                        text_name:'回收站',
                        text_name_extra:'',
                        module_name:'manageContentBackup',
                        parrent_module_name:'',
                        describe:'',
                        notice:1
                    }
                ]
            }
        ]
    }
    //导航条高亮
    $scope.navState={parent:'',current:'home'}
    $scope.$on('navState',function(e,state){
        $scope.navState = state;
    });
    //关闭所有子菜单
    $scope.submenuCloseAll=false;
    $scope.nowOpen='';
    $scope.setClose=function (b,temp) {
        if(b=='toggle'){
            if(temp&&$scope.nowOpen==temp){
                $scope.submenuCloseAll=!$scope.submenuCloseAll
            }
            else{
                $scope.nowOpen=temp;
                $scope.submenuCloseAll=false;
            }
        }
        else{
            $scope.submenuCloseAll=b;
        }
    }
    //返回上级页面
    $scope.goBack=function(){
        $window.history.back()
    };
    //发送邮件
    $scope.mailContent={"to":"","subject":"","text":""};
    $scope.mailSend=function () {
        $http.post(transUrl('Operate/sendMail'),JSON.stringify($scope.mailContent))
            .then(function () {
                alert("发送成功")
            },function () {
                alert("发送失败")
            })
    }
    //socket
    var socket = io.connect(transUrl(''));
    $scope.socketText='';
    $scope.socketSend=function () {
        socket.emit('chat message',{'user':$scope.me.data.username,'msg':$scope.socketText});
    }
    $scope.infoBox=[];
    socket.on('chat message', function(msgitem){
        $scope.infoBox.push(msgitem);
        $scope.$apply();
    });
})

