"use strict";
const User = require('../../model/user.js');

//用户登陆模块 GET
exports.loginRe =(req,res)=>{
            let auser = new User({phoneNum:req.query.userphone,passWord:req.query.password});
            auser.login((status,secrect)=>{
                (status===false)?status='error':status='success';
                let data={
                    error:0,
                    status: status,
                    data:{
                        key:secrect
                    }
                };

                if(data.status=='success'){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data));
                }else{
                    data.error=212;
                    data.error_code=212;data.error_message="login false,your password was destroyed";
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data));
                }
            })

};
//重新授权登陆模块请求  PUT
exports.relogin=(req,res)=>{
   let auser = new User({phoneNum:req.body.userphone,passWord:req.body.password});
   auser.reloginRe((secrect,exist)=>{
       let data={
           status:"",
           data:{
               secrect:secrect,
               exists:null
           }
       };
       //如果密码错误
       if(secrect==false) {
           data.status="error";
           delete data.data;
           data.error_code=212;
           data.error_message="login false,your secrect key was destroyed";
           res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
           res.end(JSON.stringify(data));
       }else{
           data.status="success";
           data.data.exists=exist;
           res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
           res.end(JSON.stringify(data));
       }
   })
};
//用户注册模块
exports.regesterRe=(req,res)=>{
       let auser = new User({phoneNum:req.body.userphone,passWord:req.body.password});
       auser.registerRe((status,screct)=>{
           let data={
               error:0,
               status:"",
               data:{

               }
           };
           if(status==true){
               data.status="success";
               data.data.key=screct;
           }else{
               data.status="false";
               data.error=222;
           }
           res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
           res.end(JSON.stringify(data));
       });


};
//获取用户信息
exports.userInfoRe=(req,res)=>{
    //action:"getinfo"
   let auser=new User({phoneNum:req.query.userphone,screctKey:req.query.key});
    auser.userInfoRe((tryout)=>{
        let data={
            error:0,
            status:""
        };
    if(tryout){
        data.status="success";
        data.data={
            info:tryout[0]
        };
    }else{
        //未经过key验证
        data.status="error";
        data.error=212
    }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });
};
//用户自动登录接口
exports.autoUserLogin=(req,res)=>{
    let adriver=new User({phoneNum:req.query.userphone,screctKey:req.query.key});
    adriver.autoUserLogin((result)=>{
    let data={
        error:0,
      status:"success"
    };
        if(result==false){
            data.error=1;
            data.status="error"
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });
};
//用户提交订单
exports.postComment=(req,res)=>{
let adriver=new User({phoneNum:req.body.thisphonenum});
    adriver.order=req.body.order;
    adriver.comment=req.body.comment;
    adriver.credit=req.body.credit;
    adriver.drivernum=req.body.drivernum;
    adriver.postComment((results)=>{
    let data={
        error:0,
        status:"success"
    };
        if(results==false){
            data.status="false";
            data.error=212;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })

};
//用户查看自身订单
exports.getorder=(req,res)=>{
    let adriver=new User({phoneNum:req.query.userphone});
    adriver.getUserOrder((result)=>{
        let data={
            error:0,
            status:"success",
            data:{}
        };
        if(result===false){
            data.status="false";
            data.error=212;
        }else{
            data.data=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//找回密码
exports.forgetPassword=(req,res)=>{
    let adriver=new User({phoneNum:req.body.userphone,passWord:req.body.password});
    adriver.forgetPassword((status)=>{
        let data={
            error:0,
            status:"success"
        };
  if(status===false){
      data.error=212;
          data.status="error";
  }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
