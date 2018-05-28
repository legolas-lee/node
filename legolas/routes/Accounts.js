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

var returnAdminRouter = function(io) {
    var router=express.Router();
    router.use(multerObj.any());
    router.use(bodyParser.urlencoded({ extended: false }));
    //获取角色列表
    router.get('/getRoleList',function (req,res) {
        var sql="SELECT * FROM list_roles";
        db.query(sql,function (err,data) {
            if(err){
                console.log('[查询错误] - ',err.message)
            }
            else{
                res.send(data).end();
            }
        })
    })
    //更新角色
    router.post('/updateRole',function (req,res) {
        var reqData=req.body;
        var sql="UPDATE list_roles SET name='"+reqData.name+"',level='"+reqData.level+"',privilege='"+reqData.privilege+"' WHERE ID='"+reqData.ID+"'";
        db.query(sql,function (err,data) {
            if(err){
                res.send(err)
            }
            else{
                res.send('操作成功！')
            }
        })
    })
    //获取账户列表
    router.get('/getAccountsList',function (req,res) {
        io.emit('chat message',{'user':'system','msg':'账户列表已更新'} );
        var ID=req.query.ID;
        var sql="SELECT * FROM list_accounts";
        db.query(sql,function (err,data) {
            if(err){
                console.log('[查询错误] - ',err.message)
            }
            else{
                var dataToSend=[];
                for (var i=0; i<data.length; i++) {
                    var j={};
                    j.id=data[i].ID;
                    j.avatar=data[i].avatar;
                    j.username=data[i].username;
                    dataToSend.push(j);
                }
                res.send(dataToSend)
            }
        })
    })
    //获取账户信息
    router.get('/getAccountInfo',function (req,res) {
        var ID=req.query.ID;
        var sql="SELECT * FROM list_accounts WHERE ID="+ID;
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
            var sql="INSERT INTO list_accounts(avatar,username,password,privilege,realname,sex,bithday,tel,email,qq,wechat,address,homepage) VALUES('"+reqData.avatar+"','"+reqData.username+"','"+reqData.password+"','"+reqData.privilege+"','"+reqData.realname+"','"+reqData.sex+"','"+reqData.bithday+"','"+reqData.tel+"','"+reqData.email+"','"+reqData.qq+"','"+reqData.wechat+"','"+reqData.address+"','"+reqData.homepage+"')";
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
            var filetype=pathLib.parse(file.originalname).ext;
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
        var id=req.query.id;
        //查询头像文件
        db.query('SELECT avatar FROM list_accounts WHERE ID='+id,function (err,data) {
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
        db.query('DELETE FROM list_accounts WHERE ID='+id,function (err,data) {
            if(err){
                console.log('[查询错误] - ',err.message)
            }
            else{
                res.send(data)
            }
        })
    })
    //修改账户信息
    router.post('/updateAccount',function (req,res) {
        var reqData=JSON.parse(req.body.data);
        var saveTodb=function () {
            var sql="UPDATE list_accounts SET avatar='"+reqData.avatar +
                "', username='"+reqData.username +
                "', password='"+reqData.password +
                "', privilege='"+reqData.privilege +
                "', realname='"+reqData.realname +
                "', sex='"+reqData.sex +
                "', bithday='"+reqData.bithday +
                "', tel='"+reqData.tel +
                "', email='"+reqData.email +
                "', qq='"+reqData.qq +
                "', wechat='"+reqData.wechat +
                "', address='"+reqData.address +
                "', homepage='"+reqData.homepage +
                "' WHERE ID= '"+reqData.ID+"'";
            //console.log(sql)
            db.query(sql,function (err,data) {
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
            var filetype=pathLib.parse(file.originalname).ext;
            var filename=file.filename;
            fs.rename(file.path,file.path+filetype,function (err) {
                if(err){
                    return console.log("重命名文件失败")
                }
                else{
                    //查询旧的头像文件
                    db.query('SELECT avatar FROM list_accounts WHERE ID='+reqData.ID,function (err,data) {
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