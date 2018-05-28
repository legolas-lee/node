/**
 * Created by kreta on 2018/5/28.
 */
const express=require('express');
const bodyParser=require('body-parser');
const nodemailer = require('nodemailer');
module.exports=function (io) {
    var router=express.Router();
    router.use(bodyParser.urlencoded({ extended: false }));
    router.post('/sendMail',function (req,res) {
        var mail=req.body;
        var result=nodemailer.sendMails(mail.to, mail.subject, mail.text);
        res.send(result)
    })
    return router;
}