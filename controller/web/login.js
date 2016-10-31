"use strict";
const login=require('../../proxy/logAndReg');
let {Driver,Admin}  = require('../../model/driver.js');
exports.driverlogin=(req,res)=>{
let adriver=new Driver({phoneNum:req.body.phonenum,passWord:req.body.password});
   adriver.login((result)=>{
    if(result==false){
        //账户密码错误
        req.session.login=false;
      return  res.redirect('/login');
    }else{
        if(result[0].driverAdmin==1){
            req.session.admin=true;
        }
        req.session.login=null;
        req.session.user=result[0].driverPhone;
        req.session.username=result[0].driverName;
        req.session.fleetid=result[0].fleetId;
        return  res.redirect('/');
    }
   })

};