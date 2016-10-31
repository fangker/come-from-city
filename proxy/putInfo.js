"use strict";
const{query,redis} =require('../model/db/index.js');
const jpush =require('../utils/jpush').jpush;
//获得用户信息  RESTFUL / WEB
exports.userInfo = (that, callback)=> {
    query('SELECT user_phone as userPhone,user_name as userName,user_state as userState,points,user_money as userMoney,user_photo  as userPhoto FROM `user` WHERE 	`user_phone`= ?', [that.phoneNum], (qerr, results, fields)=> {
        callback(results);
    });
};
//获得用户提供所在2区域位置车队信息  RESTFUL
exports.getFitFleet = (that, callback)=> {
    query('SELECT * FROM `fleet` join (SELECT * FROM `fleet_city` WHERE  `start_city`= ? AND`end_city` = ?) as map on fleet.fleet_id = map.fleet_id',[that.startPoint,that.endPoint],(qerr, results, fields)=> {
        callback(results);
    })
};
//用户获得司机信息
exports.getDriver=(driver,callback)=>{
    query('SELECT driver_phone as driverPhone,driver_name as driverName,driver_number as driverNumber,driver_identity as driverIdentity,driver_evaluate as driverEvaluate FROM `driver` WHERE  `driver_phone`= ? ',[driver.driverphone],(qerr,results,fields)=>{
        if(qerr){
            callback(false);
        }else{
            callback(results);
        }

    })

};
//司机更新提交位置信息
exports.putDriverPostion=(that,callback)=>{
    //参数错误
    let position=that.putPostion;
     let array=position.split(',');
    if(array.length!=2){
        callback(false);
    }else{
        redis.select(4);
        redis.hmset(that.phoneNum,"longitude",array[0],"latitude",array[1],(err, reply)=>{
            callback(true);
        })
    }

};
exports.getDriverPostion=(that,callback)=>{
    redis.select(4);
    redis.hmget(that.appoint,["longitude","latitude"],(err, reply)=>{
        let position={"longitude":reply[0],"latitude":reply[1]};
        callback(position);
    })
};
exports.putDriverInfo=(that,callback)=>{
    query('UPDATE `driver` SET driver_sex=?,driver_name=?,driver_number=?,driver_identity=? WHERE driver_phone = ?',[that.driverSex,that.driverName,that.driverNumber,that.driverIdentity,that.phoneNum],(qeer,result,field)=>{
        if(!qeer){
            callback(result);
        }else{
            callback(false);
        }

    })
};
//用户提交评论
exports.postComment=(that,callback)=>{
    console.log(that);
    query('INSERT INTO comment(tem_order,driver_phone,user_phone,order_comment,'+
        'order_credit) VALUES(?,?,?,?,?) ',[that.order,that.drivernum,that.phoneNum,that.comment,that.credit,that.order],(qeer,results,field)=>{
        if(qeer){
            callback(false);
        }else{
            query(`update tem_order set comment =1 where tem_id=?`,[that.order],(qeer,results,field)=>{
                callback(true);
            });

        }
    })
};
//更改为离线状态
exports.putDriverSituation=(that,callback)=>{
    if(that.situation=="offline"){
        redis.select(4);
        //移除元素
        redis.srem(`${'online@'+that.fleetId}`,that.phoneNum,(qeer,result)=>{
            if(qeer){
                callback(false);
            }else{
                if(result==0){
                    return callback(false);
                }else {
                    callback('offline');
                }
            }
        });
    }else if(that.situation=="online"){
        redis.select(4);
        redis.sadd(`${'online@'+that.fleetId}`,that.phoneNum,(qeer,result)=>{
            if(qeer){
                callback(false);
            }else{
                if(result==0){
                    return callback(false);
                }else {
                    callback('online');
                }
            }
        })
    }else{
        return 0;
    }

};
//管理员确认订单
exports.putFleetTemOrder=(that,callback)=>{
    query(`UPDATE  tem_order LEFT JOIN  driver ON driver.fleet_id =tem_order.fleet_id SET order_status = 1
     WHERE driver_phone= ? AND driver_admin=1 AND tem_id=?`,[that.phoneNum,that.temId],(qeer,result,field)=>{
        (qeer)
        ?callback(false)
        :callback(true)
    });
};
//发布公告
exports.postNotice=(that,callback)=>{
    new Promise((resolve)=>{
        query('select fleet_id from driver where driver_admin=1 and driver_phone=?',[that.phoneNum],(qeer,result,field)=>{
            if(qeer){
                callback(false)
            }else{
                if(result.length===0){
                    callback(false)
                }else{
                    resolve(result[0].fleet_id)
                }
            }
        });
    }).then((fleetid)=>{
        redis.select(0);
        redis.set(`notice${fleetid}`,`${that.notice}`,(qeer,result)=>{
                jpush(`【最新公告】:${that.notice}`,'',['tag',fleetid],'D');
            (qeer)
            ?callback(false)
            :callback(result)
        }
        )
    });


 };
//获得公告
exports.getNotice=(that,callback)=>{
    redis.select(0);
    redis.get(`notice${that.fleetId}`,(qeer,result)=>{
        (qeer)
            ?callback(false)
            :callback(result)
})
};


// WEB 修改个人信息
exports.putUserInfo=(that,callback)=>{
    query(`UPDATE driver  SET  driver_name = ?, driver_sex= ?,driver_identity= ?,driver_number=?,driver_type=? WHERE driver_phone = ?`
        ,[that.driverName,that.driverSex,that.driverIdentity,that.driverNum,that.driverType,that.user],(qeer,results,field)=>{
            if(qeer){
                callback(false);
            }else{
                callback(true);
            }
        })
};
//WEB 创建车队
exports.createFleet=(that,callback)=>{
        query(`call create_fleet(?,?,?,?,@id)`,[that.fleetName,that.fleetPhone,that.fleetInfo,that.user],(qeer,results,field)=>{
            if(qeer){
                callback(false);
            }else{
                callback(true);
            }
        })
};
//添加线路
exports.newRoute=(that,callback)=>{
    query('call create_route(?,?,?,?,?,?)',[that.fleetId,that.startCity,that.endCity,that.cityCost,that.cityreCost,that.distance],(qeer,result,field)=>{
        (qeer)
        ?callback(false)
        :callback(true)
    })
};



