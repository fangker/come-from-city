"use strict";
const mysql = require('../model/db/index.js').query;
const redis = require('../model/db/index.js').redis;
const crypto = require('crypto');
//usemd5
let usemd5=(content)=>{
    let md5=crypto.createHash('md5');
    let secrect=md5.update(content);
   return secrect.digest('hex');
};


//乘车人注册 WEB
exports.userRegister = (regmessage, callback)=> {
    //入表对应规则
    let regmessageA = {
        user_name: regmessage.userName,
        user_password: regmessage.passWord,
        user_phone: regmessage.phoneNum
    };
    mysql('INSERT INTO user SET ? ', regmessageA, (qerr, results, fields)=> {
        if (qerr || qerr.errno == 1062) {
            callback(qerr, null);
        } else {
            callback(null, results);
        }
    });
};
//司机注册    WEB

exports.driverRegister = (regmessage, callback)=> {
    //入表对应规则
    let messageB = {
        drive_name: regmessage.userName,
        drive_password: regmessage.passWord,
        drive_phone: regmessage.phoneNum,
        drive_number: regmessage.permitId
    };

    mysql('INSERT INTO `user` SET ？', messageB, (qerr, results, fields)=> {
        if (qerr) {
            callback(qerr, null);
        } else {
            callback(null, results);
        }
    });
};
//司机注册 Restful
exports.driverRegisterRe = (regmessage, callback)=> {
    let driver = {
        driver_password: regmessage.passWord,
        driver_phone: regmessage.phoneNum
    };
    mysql('INSERT INTO `driver` SET ?', driver, (qerr, results, fields)=> {
        if (qerr) {
            callback(false, null);
        } else {
            let stamp;
            stamp =usemd5((Date.now()).toString());

            //存入4号库
            redis.select(4);
            redis.hmset(regmessage.phoneNum, "key", stamp, "longitude", "0", "latitude", "0", (err, reply) => {
                callback(true, stamp);
            });
        }
    });
};

//乘车人登陆认证 Restful
exports.userLogRe = (logphone, logpass, callback) => {
    mysql('SELECT * FROM `user` WHERE `user_phone`= ? and	`user_password` = ?', [logphone, logpass], (qerr, results, fields) => {
        if (!qerr) {
            if (results.length == 0) {
                callback(false, null);
            } else {
                //生成随机数字+时间戳特征数字
                let stamp;
                stamp =usemd5((Date.now()).toString());
                //存入3号库
                redis.select(3);
                redis.hmset(logphone, "key", stamp, "longitude", "0", "latitude", "0", (err, reply) => {
                    if (err) {
                        //写入日志记录
                    }
                    //返回唯一KEY
                    callback(true, stamp);
                })

            }
        } else {
            //查询错误
        }
    })
};
//乘车人登陆认证 web
exports.userLog = (logphone, logpass, callback)=> {
    mysql('SELECT * FROM `user` WHERE `user_phone`= ? and	`user_password` = ?', [logphone, usemd5(logpass)], (qerr, results, fields)=> {
        if (!qerr) {
            if (results.length != 0) {
                callback(false);
            } else {
                callback(true);
            }
        }
    })
};
//二次登陆认证 Restful PUT方法
exports.reUserLogRe = (logphone, logpass, callback) => {
    mysql('SELECT * FROM `user` WHERE `user_phone`= ? and `user_password` = ?', [logphone, logpass], (qerr, results, fields) => {
        if (!qerr) {
            if (results.length == 0) {
                callback(false, null);
            } else {
                //生成随机数字+时间戳特征数字
                let stamp, num;
                stamp =usemd5((Date.now()).toString());
                //存入3号库
                redis.select(3);
                redis.exists(logphone, (err, reply) => {
                        if (err) {
                            //写入日志记录
                        }
                        //更新key的值
                        redis.hmset(logphone, "key", stamp, "longitude", "0", "latitude", "0", (err, reply) => {

                        });
                        if (reply == null) {
                            callback(stamp, null);
                        } else {
                            callback(stamp, 1)
                        }
                    }
                )

            }
        } else {
            //查询错误
        }
    })
};
//Restful POST方法 用户注册
exports.useRegisterrRe = (logphone, logpass, callback)=> {
    mysql('INSERT INTO user(user_phone,user_password) VALUES(?,?)', [logphone, logpass], (qerr, results, fields)=> {
        if (qerr) {
            if (qerr.errno == 1062) {
                callback(false, null);
            }
        } else {
            let stamp;
            stamp =usemd5((Date.now()).toString());
            //存入3号库
            redis.select(3);
            redis.hmset(logphone, "key", stamp, "longitude", "0", "latitude", "0", (err, reply)=> {
                callback(true, stamp);
            });
        }
    })
};
//司机登陆
exports.driverLoginRe = (that, callback)=> {
    mysql('SELECT * FROM `driver` WHERE 	`driver_phone`= ? AND `driver_password`= ? ', [that.phoneNum, that.passWord], (qeer, result, field)=> {
        if (qeer || result.length == 0) {
            callback(false,null);
        } else {
            let stamp,isAdmin;
            isAdmin=result[0].driver_admin;
            stamp =usemd5((Date.now()).toString());
            redis.select(4);
            redis.hmset(that.phoneNum, "key", stamp, "longitude", "0", "latitude", "0", (err, reply)=> {
                callback(true, {stamp,isAdmin});
            });
        }
    })
};
//REST 司机自动登录
exports.autoDriverLogin=(that,callback)=>{
    redis.select(4);
    redis.hget(that.phoneNum,'key',(qeer,results)=>{
        if(results==that.userKey){
          return  callback(true);
        }else{
            return callback(false);
        }
    })
};
//REST 乘客自动登录
exports.autoUserLogin=(that,callback)=>{
    redis.select(3);
    redis.hget(that.phoneNum,'key',(qeer,results)=>{
        console.log(results,that.screctKey);
        if(results==that.screctKey){
            return  callback(true);
        }else{
            return callback(false);
        }
    })
};
//REST 用户找回密码
exports.forgetPassword=(that,callback)=>{
     mysql(`update user set  user_password =?  where user_phone = ?`,[that.passWord,that.phoneNum],(qeer,result,field)=>{
         if(qeer){
             console.log(qeer)
             callback(false);
         }else{
             callback(true);
         }

     });
};

//WEB司机登陆认证
exports.driverLogin=(that,callback)=>{
    mysql(`SELECT fleet_id as fleetId,driver_phone as driverPhone,driver_name as driverName ,driver_admin as driverAdmin FROM driver WHERE 	driver_phone= ? AND driver_password= ? `,[that.phoneNum,usemd5(that.passWord)],(qeer,result,field)=>{
        if(qeer){

        }else{
            (result.length==0)
                ? callback(false)
                :  callback(result);
            }
        })
    };

