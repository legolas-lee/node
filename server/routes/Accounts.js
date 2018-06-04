/**
 * Created by kreta on 2018/5/26.
 */
const express=require('express');
const db=require('./MySQL');
const multer=require('multer');
const multerObj=multer({dest: './static/public/upload/avatar'});
const bodyParser=require('body-parser');
const pathLib=require('path');
const fs=require('fs')
var makeSql=require('./MakeSQL')

var returnAdminRouter = function(io) {
    var router=express.Router();
    router.use(multerObj.any());
    router.use(bodyParser.urlencoded({ extended: false }));
    //获取角色列表
    router.get('/getRoleList',function (req,res) {
        var sql=makeSql({
            table:'list_roles',
            operate:'SELECT',
            field:'*'
        })
        db.query(sql,function (err,data) {
            if(err){
                console.log('[查询错误] - ',err.message)
            }
            else{
                res.send(data);
            }
        })
    })
    //添加角色
    router.post('/addRole',function (req,res) {
        var reqData=(req.body);
        var sql=makeSql({
            table:'list_roles',
            operate:'INSERT',
            data:reqData
        })
        db.query(sql,function (err,data,fields) {
            if(err){
                res.send(err)
            }
            else{
                res.send({'msg':'操作成功，角色已添加！'})
            }
        })
    })
    //更新角色
    router.post('/updateRole',function (req,res) {
        var reqData=req.body;
        var sql=makeSql({
            table:'list_roles',
            operate:'UPDATE',
            data:reqData
        })
        db.query(sql,function (err,data) {
            if(err){
                res.send(err)
            }
            else{
                res.send({'msg':'操作成功！角色已更新！'})
            }
        })
    })
    //删除角色
    router.get('/delRole',function (req,res) {
        var ID=req.query.ID;
        var sql=makeSql({
            table:'list_roles',
            operate:'DELETE',
            data:ID
        });
        db.query(sql,function (err,data) {
            if(err){
                console.log(err)
            }
            else{
                res.send({'msg':'操作成功，角色已删除！'})
            }
        })
    });
    //获取账户列表
    router.get('/getAccountsList',function (req,res) {
        io.emit('chat message',{'user':'system','msg':'账户列表已更新'} );
        var ID=req.query.ID;
        var sql=makeSql({
            table:'list_accounts',
            operate:'SELECT',
            field:'*'
        })
        db.query(sql,function (err,data) {
            if(err){
                console.log(err)
            }
            else{
                var dataToSend=[];
                for (var i=0; i<data.length; i++) {
                    var j={};
                    j.id=data[i].ID;
                    j.avatar=data[i].avatar;
                    j.username=data[i].username;
                    j.privilege=data[i].privilege;
                    j.sex=data[i].sex;
                    j.last_login_time=data[i].last_login_time;
                    dataToSend.push(j);
                }
                res.send(dataToSend)
            }
        })
    })
    //获取账户信息
    router.get('/getAccountInfo',function (req,res) {
        var ID=req.query.ID;
        var sql=makeSql({
            table:'list_accounts',
            operate:'SELECT',
            field:'*',
            queryterm:'ID='+ID
        })
        db.query(sql,function (err,data) {
            if(err){
                console.log('[查询错误] - ',err.message)
            }
            else{
                if(data.length<1){
                    console.log('数据库连接成功，但未查询到结果')
                }
                else{
                    io.emit('chat message',{'user':'system','msg':'用户:'+data[0].username+' 的个人信息已更新'} );
                    res.send(data);
                }
            }
        })
    })
    //添加账户
    router.post('/addAccount',function (req,res) {
        var reqData=JSON.parse(req.body.data);
        var saveTodb=function () {
            var sql=makeSql({
                table:'list_accounts',
                operate:'INSERT',
                data:reqData
            })
            db.query(sql,function (err,data) {
                if(err){
                    console.log('[查询错误] - ',err.message)
                }
                else{
                    res.send(data)
                }
            })
        };
        var file=req.files[0];
        if(file){
            var filetype=pathLib.parse(file.originalname).ext||'.png';
            var filename=file.filename;
            fs.rename(file.path,file.path+filetype,function (err) {
                if(err){
                    return console.log("重命名文件失败")
                }
            })
            reqData.avatar='/public/upload/avatar/'+filename+filetype;
            saveTodb();
        }
        else{
            reqData.avatar='';
            saveTodb();
        }
    })
    //删除账户
    router.get('/delAccount',function (req,res) {
        var ID=req.query.id;
        if(ID==0){
            res.status(403);
            res.send({msg:"你没有权限删除超级管理员账户！"})
        }
        else{
            //查询头像文件
            var sqlQuery=makeSql({
                table:'list_accounts',
                operate:'SELECT',
                field:'avatar',
                queryterm:'ID='+ID
            })
            db.query(sqlQuery,function (err,data) {
                if(err){
                    console.log('[查询错误] - ',err.message)
                }
                else{
                    if(data.length<1){
                        console.log('数据库连接成功，但未找到头像')
                    }
                    else{
                        //删除头像文件
                        fs.unlink('static'+data[0].avatar,function (err) {
                            if(err){
                                console.log(err)
                            }
                            else{
                                console.log('头像文件删除成功')
                            }
                        })
                    }
                }
            })
            //删除数据
            var sqlDel=makeSql({
                table:'list_accounts',
                operate:'DELETE',
                queryterm:'ID='+ID
            })
            db.query(sqlDel,function (err,data) {
                if(err){
                    console.log('[查询错误] - ',err.message)
                }
                else{
                    res.send(data)
                }
            })
        }
    })
    //修改账户信息
    router.post('/updateAccount',function (req,res) {
        var reqData=JSON.parse(req.body.data);
        var saveTodb=function () {
            var sqlUpdate=makeSql({
                table:'list_accounts',
                operate:'UPDATE',
                data:reqData
            })
            db.query(sqlUpdate,function (err,data) {
                if(err){
                    return console.log(err)
                }
                else{
                    res.end();
                }
            })
        }
        var file=req.files[0];
        if(file){
            var filetype=pathLib.parse(file.originalname).ext||'.png';
            var filename=file.filename;
            fs.rename(file.path,file.path+filetype,function (err) {
                if(err){
                    return console.log("重命名文件失败")
                }
                else{
                    var sqlQuery=makeSql({
                        table:'list_accounts',
                        operate:'SELECT',
                        field:'avatar',
                        queryterm:'ID='+reqData.ID
                    })
                    //查询旧的头像文件
                    db.query(sqlQuery,function (err,data) {
                        if(err){
                            return console.log(err)
                        }
                        else{
                            if(data.length<1){
                                return console.log('数据库连接成功，但未找到头像')
                            }
                            else{
                                //删除头像文件
                                fs.unlink('static'+data[0].avatar,function (err) {
                                    if(err){
                                        return console.log(err)
                                    }
                                })
                            }
                        }
                    })
                }
            })
            reqData.avatar='/public/upload/avatar/'+filename+filetype;
            saveTodb();
        }
        else{
            saveTodb();
        }
    })
    return router;
}
module.exports = returnAdminRouter;