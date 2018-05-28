/**
 * Created by kreta on 2018/5/26.
 */
/**
 * Created by kreta on 2018/5/26.
 */
const express=require('express');
const db=require('./MySQL');
const multer=require('multer');
const multerObj=multer({dest: './static/public/upload/content'});
const bodyParser=require('body-parser');
const pathLib=require('path');
const fs=require('fs')
var returnAdminRouter = function(io) {
    var router=express.Router();
    router.use(multerObj.any());
    router.use(bodyParser.urlencoded({ extended: false }));
    //获取内容列表
    router.get('/getContentList',function (req,res) {
        var sql="SELECT * FROM list_content";
        db.query(sql,function (err,data) {
            if(err){
                return console.log('[查询错误] - ',err.message)
            }
            else{
                res.send(data);
            }
        })
    })
    //添加内容
    router.post('/addContent',function (req,res) {
        var reqData=JSON.parse(req.body.data);
        var saveTodb=function () {
            var sql="INSERT INTO list_content(star,title,title_extra,update_time,pic,content_desc,outlink,content,author,view,likes) VALUES('"+reqData.star+"','"+reqData.title+"','"+reqData.title_extra+"','"+reqData.update_time+"','"+reqData.pic+"','"+reqData.content_desc+"','"+reqData.outlink+"','"+reqData.content+"','"+reqData.author+"','"+reqData.view+"','"+reqData.likes+"')";
            db.query(sql,function (err,data) {
                if(err){
                    return console.log(err)
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
            reqData.pic='/public/upload/content/'+filename+filetype;
            saveTodb();
        }
        else{
            reqData.pic='';
            saveTodb();
        }
    });
    //删除内容
    router.get('/delContent',function (req,res) {
        var id=req.query.id;
        db.query("SELECT pic FROM list_content WHERE ID="+id,function (err,data) {
            if(err){
                console.log('[删除图片时数据库查询错误] - ',err.message)
            }
            else{
                if(data.length<1){
                    console.log('数据库连接成功，但未找到图片')
                }
                else{
                    //删除图片文件
                    fs.unlink('static'+data[0].pic,function (err) {
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log('图片文件删除成功')
                        }
                    })
                }
               //删除数据库中内容
                db.query('DELETE FROM list_content WHERE ID='+id,function (err,data) {
                    if(err){
                        return console.log('[查询错误] - ',err.message)
                    }
                    else{
                        res.send(data)
                    }
                })
            }
        })
    })
    //获取内容详情
    router.get('/getContentDetail',function (req,res) {
        var id=req.query.id;
        db.query("SELECT * FROM list_content WHERE ID="+id,function (err,data) {
            if(err){
                return console.log('[查询错误] - ',err.message)
            }
            else{
                res.send(data)
            }
        })
    })
    //更新内容
    router.post('/updateContent',function (req,res) {
        var reqData=JSON.parse(req.body.data);
        var saveTodb=function () {
            var sql="UPDATE list_content SET star='"+reqData.star +
                "', title='"+reqData.title +
                "', title_extra='"+reqData.title_extra +
                "', update_time='"+reqData.update_time +
                "', pic='"+reqData.pic +
                "', content_desc='"+reqData.content_desc +
                "', outlink='"+reqData.outlink +
                "', content='"+reqData.content +
                "', author='"+reqData.author +
                "', view='"+reqData.view +
                "', likes='"+reqData.likes +
                "' WHERE ID= '"+reqData.ID+"'";
            //console.log(sql)
            db.query(sql,function (err,data) {
                if(err){
                    return console.log(err)
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
                else{
                    //查询旧的图片文件
                    db.query('SELECT pic FROM list_content WHERE ID='+reqData.ID,function (err,data) {
                        if(err){
                            return console.log(err)
                        }
                        else{
                            if(data.length<1){
                                return console.log('数据库连接成功，但未找到头像')
                            }
                            else{
                                //删除图片文件
                                fs.unlink('static'+data[0].pic,function (err) {
                                    if(err){
                                        return console.log(err)
                                    }
                                })
                            }
                        }
                    })
                }
            })
            reqData.pic='/public/upload/content/'+filename+filetype;
            saveTodb();
        }
        else{
            saveTodb();
        }
    })
    return router;
}
module.exports = returnAdminRouter;