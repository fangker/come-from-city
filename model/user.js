"use strict";
const  regAndLog=require('../proxy/logAndReg.js');
const  getPutInfo=require('../proxy/putInfo.js');
const  getInfo=require('../proxy/getInfo.js');
class User {
    //构造函数
  constructor({userName,passWord,phoneNum,screctKey}){
      Object.assign(this,{userName,passWord,phoneNum,screctKey})
  }
   //构造对象
    //用户注册 WEB
    register(callback){
        regAndLog.userRegister(this,(qerr, result)=>{
        callback(qerr,result);
    })
    }
    //用户登陆
    login(callback) {
        regAndLog.userLogRe(this.phoneNum,this.passWord,(statues, secrectkey)=>{
            callback(statues,secrectkey);
        })
    }
    //用户登陆REST 重新生成认证
    reloginRe(callback){
       regAndLog.reUserLogRe(this.phoneNum,this.passWord,(secrect, exist)=>{
        callback(secrect,exist);
        })
    }
    //用户注册REST
    registerRe(callback){
       regAndLog.useRegisterrRe(this.phoneNum,this.passWord,(status, screct)=>{
           callback(status,screct);
       })
    }
    //获取用户信息REST
    userInfoRe(callback){
       let That={phoneNum:this.phoneNum,screctKey:this.screctKey};
       getPutInfo.userInfo(That,(tryout)=>{
           callback(tryout);
       })


    }
  //用户自动登录
    autoUserLogin(callback){
        let That={phoneNum:this.phoneNum,screctKey:this.screctKey};
        regAndLog.autoUserLogin(That,(tryout)=>{
            callback(tryout);
        });
    }
  //用户提交评论
    postComment(callback){
       let That={phoneNum:this.phoneNum,temOrder:this.temOrder,comment:this.comment,order:this.order,drivernum:this.drivernum,credit:this.credit};
        getPutInfo.postComment(That,(tryout)=>{
            callback(tryout);
        });

    }
  //用户获得用户订单
    getUserOrder(callback){
        let That={phoneNum:this.phoneNum};
        getInfo.getUserOrder(That,(tryout)=>{
            callback(tryout);
        });
    }
  //用户找回密码
    forgetPassword(callback){
       let That={phoneNum:this.phoneNum,passWord:this.passWord};
        regAndLog.forgetPassword(That,(tryout)=>{
            callback(tryout);
        })
    }

}
module.exports=User;


