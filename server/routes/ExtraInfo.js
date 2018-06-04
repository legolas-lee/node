/**
 * Created by kreta on 2018/5/19.
 */
const express=require('express');
const os=require('os');

module.exports=function (io) {
    var router=express.Router();
    router.get('/ServerInfo',function (req,res) {
        io.emit('chat message',{'user':'system','msg':'服务器信息已更新'} );
        //服务器信息
        var time=os.uptime();
        var days = Math.floor(time / 1440 / 60);
        var hours = Math.floor((time - days * 1440 * 60) / 3600);
        var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
        var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60).toFixed(0);
        var newtime=days+' 天 '+hours+' 小时 '+minutes+' 分 '+seconds+' 秒 ';
        var freemem=os.freemem();
        var gb=parseInt(os.freemem() / 1024 / 1024 / 1024);
        var mb=parseInt((freemem-(gb*1024*1024*1024))/1024/1024);
        var newfreemem=gb+'GB '+mb+'MB';
        var serverInfo= {
            "title": "服务器信息",
            "data": {
                cpu_model: {
                    "text_name": "CPU处理器名称",
                    "value": os.cpus()[0].model,
                    "describe": "",
                    "extra": os.cpus()
                },
                cpu_speed: {
                    "text_name": "CPU处理器速度",
                    "value": os.cpus()[0].speed / 1000 + ' Ghz',
                    "describe": "",
                    "extra": os.cpus()[0].speed
                },
                os_arch: {
                    "text_name": "CPU处理器架构",
                    "value": os.arch(),
                    "describe": "",
                    "extra": ""
                },
                os_enianness: {
                    "text_name": "字节顺序",
                    "value": os.endianness(),
                    "describe": "高位优先返回BE,低位优先的返回LE",
                    "extra": ""
                },
                totalmem: {
                    "text_name": "系统总内存",
                    "value": (os.totalmem() / 1024 / 1024 / 1024).toFixed(0) + ' GB',
                    "describe": "",
                    "extra": os.totalmem()
                },
                freemem: {
                    "text_name": "系统空闲内存",
                    "value": newfreemem,
                    "describe": "",
                    "extra": os.freemem()
                },
                os_loadavg: {
                    "text_name": "平均负载",
                    "value": JSON.stringify(os.loadavg()),
                    "describe": "系统最近5、10、15分钟的平均负载,这是一个针对linux或unix的统计，windows下始终返回[0,0,0]",
                    "extra": os.loadavg()
                },
                os_hostname: {
                    "text_name": "操作系统主机名",
                    "value": os.hostname(),
                    "describe": "",
                    "extra": ""
                },
                os_type: {
                    "text_name": "操作系统名称",
                    "value": os.type(),
                    "describe": "",
                    "extra": "基于linux的返回linux,基于苹果的返回Darwin,基于windows的返回Windows_NT"
                },
                os_release: {
                    "text_name": "操作系统版本",
                    "value": os.release(),
                    "describe": "",
                    "extra": ""
                },
                os_platform: {
                    "text_name": "操作系统类型",
                    "value": os.platform(),
                    "describe": "返回值有'darwin', 'freebsd', 'linux', 'sunos' , 'win32'",
                    "extra": ""
                },
                os_homedir: {
                    "text_name": "当前用户根目录",
                    "value": os.homedir(),
                    "describe": "",
                    "extra": "当前登录用户的根目录"
                },
                os_tmpdir: {
                    "text_name": "系统临时目录",
                    "value": os.tmpdir(),
                    "describe": "操作系统临时文件的默认目录",
                    "extra": ""
                },
                // {
                //     "text_name": "服务器IP地址",
                //     "value": os.networkInterfaces().以太网[1].address,
                //     "describe":"",
                //     "extra":os.networkInterfaces()
                // },
                // {
                //     "text_name": "服务器网关",
                //     "value": os.networkInterfaces().以太网[1].netmask,
                //     "describe":"",
                //     "extra":""
                // },
                // {
                //     "text_name": "服务器MAC地址",
                //     "value": os.networkInterfaces().以太网[1].mac,
                //     "describe":"",
                //     "extra":""
                // },
                os_uptime: {
                    "text_name": "运行时间",
                    "value":newtime,
                    "describe": "服务器正常运行时间",
                    "extra": os.uptime()
                }
            }
        };
        res.send(serverInfo)
    })
    return router;
}