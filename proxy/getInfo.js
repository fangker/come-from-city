"use strict";
const{query,redis} =require('../model/db/index.js');



exports.getOwnInfo=(that,callback)=>{
    query(`SELECT 	driver_phone as driverPhone,fleet_name as fleetName,driver_name as driverName,driver_number as driverNumber,driver_status as driverStatus,driver_type as driverType,driver_coin as driverCoin,
    driver_admin as driverAdmin,driver.fleet_id as fleetId,driver_evaluate as driverEvaluate ,driver_identity as driverIdentity FROM driver  LEFT JOIN fleet ON fleet.fleet_id =driver.fleet_id WHERE	driver_phone=?
 ` ,[that.phoneNum],(qeer,result,field)=>{
        if(qeer){
            callback(false)
        }else{
            if(result.length==0){
                callback(false)
            }else{
                callback(result)
            }
        }
    });
};
//公共方法获得车队信息
let getOwnFeelInfo=(fleetId,callback)=>{
 query('SELECT fleet.fleet_id as fleetId,fleet_name as fleetName,fleet_info as fleetInfo,fleet_photo as fleetPhone, (SELECT city_name from city WHERE city.city_id= fleet_city.start_city)as startCity,(SELECT city_name from city WHERE city.city_id= fleet_city.end_city) as endCity,city_cost as cityCost,city_recost as cityRecost,default_distance as defaultDistance FROM   `fleet`LEFT JOIN`fleet_city` ON fleet.fleet_id=fleet_city.fleet_id WHERE fleet.fleet_id= ?',[fleetId],(qeer,result,field )=>{
     query('SELECT  AVG(`comment`.order_credit) as credit From `tem_order`,`comment` WHERE `tem_order`.tem_id in (SELECT `comment`.tem_order FROM `comment`) AND `tem_order`.fleet_id=?',[fleetId],(qeer,credit,field)=>{
         query('SELECT COUNT(*) as saleNum FROM `tem_order` WHERE fleet_id=? ',[fleetId],(qeer,salenum,field)=>{
             query(`SELECT COUNT(*) as fleetNomember  From driver Where fleet_id = ?`,[fleetId],(qeer,nomember,field)=>{
                 if(nomember.length==0){
                     nomember=0;
                 }

                 if(!qeer&&result.length!=0){
                     if(credit[0].credit==null){
                         credit=0;
                     }else{
                         credit=credit[0].credit;
                     }
                     let array=[];
                     for(var z of result){
                         let data={
                             startCity: z.startCity,
                             endCity: z.endCity,
                             cityCost: z.cityCost,
                             cityRecost: z.cityRecost,
                             defaultDistance: z.defaultDistance
                         };
                         array.push(data);
                     }
                     let redata={
                         error:0,
                         status:null,
                         fleetId: z.fleetId,
                         fleetName: z.fleetName,
                         fleetInfo:z.fleetInfo,
                         saleCount: salenum[0].saleNum,
                         fleetCredit: credit,
                         fleetPhone: z.fleetPhone,
                         fleetNoMember:nomember[0].fleetNomember,
                         route:array
                     };
                     callback(redata);
                 }else{
                     callback(false);
                 }

             })
            })
     })});
     };

exports.getFleetTemOrder=(that,callback)=>{
    console.log(that);
    query(`SELECT  tem_order.tem_id as temId ,order_status as status,tem_order.user_phone as passenger,(SELECT city_name as thisrow from city where city_id=start_city) as startCity,(SELECT city_name as z from city where city_id=dest_city)as destCity,create_time as createTime,
start_time as startTime,end_time as endTime,start_position as startPosition,end_position as endPosition,
  tem_order.starting,user_name as userName,price,order_id as orderId ,people,start_address as stratAdress,end_address as endAdress,order_status as orderStatus
  FROM driver LEFT JOIN tem_order ON driver.fleet_id=tem_order.fleet_id LEFT JOIN user ON tem_order.user_phone=user.user_phone
  WHERE driver.driver_phone= ? And driver.fleet_id is not null or driver.fleet_id=1 ORDER BY create_time DESC limit ?,? ;`,[that.phoneNum,parseInt(that.start),parseInt(that.end)],(qeer,results,field)=>{
    if(qeer){
        console.log(qeer);
        callback(false);
    }else{
        if(results.length==0){
            callback(null)
        }else{
            callback(results);
        }
    }
})
};
//获得管理临时订单
exports.getFleetOrder=(that,callblack)=>{
query('SELECT '+`
        user_phone as userPhone,start_city as startCity,order_id as orderId,dest_city as destCity,start_time as startTime,end_time as endTime,start_position as startPosition,
        end_position as endPosition,price,people,address
        `+'FROM `tem_order`  WHERE `order_id` in (SELECT * FROM(SELECT  `order_id`  FROM `order` WHERE driver_phone= ? limit ?,? )AS T)',[that.phoneNum,parseInt(that.start),parseInt(that.end)],(qeer,results,field)=>{
    if(qeer){
        callblack(false);
    }else{
        callblack(results);
    }

})
};
//检查最近版本
exports.checkVersion=(version,callback)=> {
    redis.smembers('version', (qeer, result0)=> {
        if (qeer) {
            callback(false)
        } else {
            redis.sismember('version', version, (qeer, result1)=> {
                if (qeer) {
                    callback(false);
                } else {
                    callback(result0[0], result1);
                }
            })
        }
    })
};
//获得车队评分
exports.getOwnCredit=(fleetid,callback)=>{
    query('SELECT AVG(order_usercredit) AS credit FROM `comment`  LEFT JOIN `order` ON `comment`.order_id=`order`.order_id WHERE fleet_id =?',
        [fleetid],(qeer,results,field)=>{
            if(qeer){
                callback(false)
            }
            let credit=results[0].credit;
            credit=credit.toFixed(2);
            callback(credit);
        })
};
//获得车队的评论信息表
exports.getFleetComment=(fleetid,start,end,callback)=>{
    query(`SELECT comment.user_phone as userPhone, start_city as start_city,dest_city as destCity,order_comtime as  orderComtime,order_comment as orderComment,
    order_credit as orderCredit FROM comment LEFT JOIN tem_order  ON
    comment.tem_order=tem_order.order_id `,[fleetid,parseInt(start),parseInt(end)],(qeer,results,field)=>{
 if(qeer){
     callback(null);
 }else{
     callback(results);
 }
    })
};
//管理获得历史拼车单
exports.getAllFleetOrder=(that,callback)=>{

   query('select order_id as orderId,order_status as status,start_time as startTime,end_time as endTime,driver_phone as driverPhone From `order` WHERE order.fleet_id=(SELECT fleet_id FROM ' +
       'driver WHERE driver_phone=? and driver_admin =1) ORDER BY `order`.order_id limit ?,?',[that.phoneNum,parseInt(that.start),parseInt(that.end)],(qeer,results,field)=>{
     if(qeer){
         callback(false);
     }else{
         callback(results);
     }
   })
};
//由拼车单获取子订单
exports.getThisTemOrder=(that,callback)=>{
    console.log(that)
query('SELECT price,tem_order.end_time as endTime ,create_time as createTime,user_phone as userPhone,(SELECT city.city_name as startCity FROM city WHERE city.city_id=tem_order.start_city) as startCity,(SELECT city.city_name as endCity FROM city WHERE city.city_id=tem_order.dest_city) as endCity FROM tem_order WHERE tem_order.order_id = (SELECT order_id FROM `order` WHERE `order`.fleet_id= ' +
    '(select fleet_id from driver WHERE driver_phone = ?  )and order_id=?) ' +
    ' AND tem_order.order_id =?',[that.phoneNum,that.orderId,that.orderId],(qeer,results,field)=>{
    if(qeer){
        callback(false)
    }else{
        callback(results)
    }
})
};
//获得司机在线信息
exports.getDriverSituation=(that,callback)=>{
    redis.select(4);
    redis.eval(`
         local round = redis.call('sismember','${'online@'+that.fleetId}','${that.phoneNum}')
        if round==0  then
            return 0
         else
            return 1
            end
    `,0,(qeer, result)=>{
        if(qeer){
            console.log(qeer)
            callback(false);
        }else{
            let situation;
            if(result==0){
                situation="offline";
            }else if(result==1){
                situation="online";
            }
            callback(situation);
        }
    }
    )
};
//管理获得车队在线人员
exports.getAllOnlinePosition=(that,callback)=>{
    redis.select(4);
    redis.eval(`
local round=redis.call('SMEMBERS',KEYS[1])
local strJson
local array={}
for i=1,#round do
local strJson='{'..'\"'.."phonenum"..'\"'..":".. '\"'..tostring(round[i])
..'\"'..","..'\"'.."position"..'\"'..":["..table.concat(redis.call('hmget',round[i],'longitude','latitude'),",").."]}"
table.insert(array,strJson)
  end
  return array

`,1,'online@'+that.fleetId,(qeer,result)=>{
        console.log(qeer,result);
        let array=[];
            if(qeer==null){
                for(let z of result){
                    array.push(JSON.parse(z));
                }
                callback(array);
            }else{
                callback(false);
            }
        }
    );
};

//获得当前位置车队信息
exports.definedInfo=(that,callback)=>{
    query(`SELECT fleet_id from  fleet_city   WHERE start_city = ?   group by fleet_id LIMIT ?,?`,[that.startPoint,parseInt(that.start),parseInt(that.end)],(qeer,results,field)=>{
        if(!qeer){
            let array=[];
            for(let i=0;i<results.length;i++){
                let promise=new Promise((resolve)=>{
                    getOwnFeelInfo(results[i].fleet_id,(data)=>{
                        delete data.error;
                        delete data.status;
                        resolve(data);
                    })
                });
                array.push(promise);
            }
            Promise.all(array).then((data)=>{
                callback(data);
            })
        }else{
            callback(false);
        }
    });
};
exports.getUserOrder=(that,callback)=>{
  query('SELECT `order`.driver_phone as driverPhone,driver_number as driverNumber,tem_order.comment as comment, tem_order.end_time as endTime,tem_id as temId,people,price,create_time as createTime,tem_order.order_status as orderStatus,(SELECT fleet_name FROM fleet WHERE fleet_id=tem_order.fleet_id )as fleetName,(SELECT city_name FROM city WHERE city_id=tem_order.start_city )as startCity,(SELECT city_name FROM city WHERE city_id=tem_order.dest_city)as endCity From  tem_order LEFT JOIN `order`ON tem_order.order_id=`order`.order_id LEFT JOIN driver ON driver.driver_phone=`order`.driver_phone Where user_phone =? ',[that.phoneNum],(qeer,result,field)=>{
   if(qeer){
       callback(false);
   }else{
       callback(result);
   }
  })
};

/*=============================================【web方法】==============================================================*/
exports.getMyFleetInfo=(fleetId,callback)=>{
    query('select fleet.fleet_id as fleetId,fleet_name as fleetName,fleet_info as fleetInfo,fleet_photo as fleetPhoto,fleet_phone as fleetPhone from driver LEFT JOIN fleet ON fleet.fleet_id=driver.fleet_id WHERE driver_phone=?',[fleetId],(qeer,result)=>{
    if(qeer){
        callback(false);
    }else{
        callback(result);
    }
    })
};
exports.profileInfo=(driverId,callback)=>{
    query('select driver_name as driverName ,driver_number as driverNumber ,driver_sex as driverSex,driver_type as driverType,driver_photo as driverPhoto,driver_identity as driverIdentity,driver_license as driverLicense from driver where driver_phone =?',[driverId],(qeer,result,field)=>{
        callback(result);
    })
};
exports.putlicense=(fileName,user,callback)=>{
    query(`update driver set driver_license=? where driver_phone=?`,[fileName,user],(qeer,result,field)=>{
        if(qeer){
            callback(false);
        }else{
            callback(true);
        }
    })
};
exports.putphoto=(fileName,user,callback)=>{
    query(`update driver set driver_photo=? where driver_phone=?`,[fileName,user],(qeer,result,field)=>{
        if(qeer){
            callback(false);
        }else{
            callback(true);
        }
    })
};
exports.getOrder=(fleetId,callback)=>{
    query('SELECT order_status as status,order_id as orderId,driver_phone as driverPhone,start_time as startTime,end_time as endTime,driver_phone as driverPhone FROM  `order` WHERE fleet_id =?',[fleetId],(qeer,results,field)=>{
        if(qeer){
           return callback(false);
        }else{
            return callback(results)
        }
    });
};
//获得临时订单
exports.getTemOrder=(orderId,callback)=>{
   query('SELECT price,user_phone as userPhone,`starting`,people,(SELECT city_name from city WHERE city.city_id=tem_order.start_city) AS startCity,(SELECT city_name from city WHERE city.city_id=tem_order.dest_city ) AS endCity FROM tem_order WHERE order_id =?',[orderId],(qeer,results,field)=>{
       if(qeer){
           callback(false);
       }else{
           callback(results);
       }
   })
};
exports.getMember=(fleetId,callback)=>{
    query(`SELECT driver_name AS driverName,driver_sex AS sex,driver_number AS driverNumber,driver_evaluate as evaluate ,driver_type AS driverType,driver_admin AS driverAdmin,driver_phone as driverPhone FROM  driver where  fleet_id = ?`,[fleetId],(qeer,result,field)=>{
        console.log(result,qeer);
        callback(result);
    })
};
exports.delMember=(adminId, user, callback)=>{
    query(`SELECT automatic,default_distance as distance,city_cost as cityCost,city_recost as cityRecost,sign_id as signId,(SELECT city_name  FROM city WHERE city_id=fleet_city.start_city )as startCity,(SELECT city_name  FROM city WHERE city_id=fleet_city.end_city )as endCity  FROM fleet_option LEFT JOIN fleet_city on fleet_option.fleet_id=fleet_city.fleet_id
     WHERE fleet_option.fleet_id=  (SELECT fleet_id FROM driver WHERE driver_phone= ? and driver_admin=1)`,[adminId,user],(qeer,result,field)=>{
        if(qeer){
            callback(false);
        }else{
            callback(true);
        }
    })
};
//车队选项页面和路线
exports.fleetOption=(user,callback)=>{
  query(` SELECT (SELECT city_name FROM city WHERE city_id=start_city) as startCity,(SELECT city_name FROM city WHERE city_id=end_city) as endCity,city_cost as cityCost,city_recost as cityRecost,sign_id as signId,default_distance as distance FROM fleet_option LEFT JOIN fleet_city on fleet_option.fleet_id=fleet_city.fleet_id  WHERE fleet_option.fleet_id=
   (SELECT fleet_id FROM driver WHERE driver_phone= ? and driver_admin=1) `,[user],(qeer,results,field)=>{
      if(qeer){
       console.log(qeer);
      }else{
          callback(results);
      }
  })
};
//删除路线选项
exports.delRoute=(adminId,route,callback)=>{
        query(`DELETE FROM fleet_city WHERE fleet_id = (SELECT fleet_id FROM driver WHERE driver.driver_phone=?
         and driver.driver_admin=1) AND sign_id=?`,[adminId,route],(qeer,results,field)=>{
            if(qeer){
                console.log(qeer)
                callback(false);
            }else{
                callback(true);
            }
        })

    };

exports.getOwnOrder=(that,callback)=>{
     query('select order_id as orderid ,start_time as starttime ,end_time as  endtime ,order_status as orderstatus,driver_phone as driverphone from `order`  where driver_phone =?',[that.phoneNum],(qeer,result,field)=>{
        if(qeer){
            callback(false);
        }else{
            callback(result);
        }
     })
};
//获得所有成员
exports.getAllMember=(that,callback)=>{
     query('SELECT driver_phone as driverPhone,driver_number as driverNumber,driver_name as driverName from driver  WHERE fleet_id=(SELECT fleet_id FROM driver WHERE driver_admin=1 AND driver_phone=?) limit ?,?',[that.phoneNum,Number(that.start),Number(that.end)],(qeer,result,field)=>{
         (qeer)
         ?callback(false)
         :callback(result)
     })
};


exports.getOwnFeelInfo=getOwnFeelInfo;