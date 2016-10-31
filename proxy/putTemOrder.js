"use strict";
const mysql = require('../model/db/index.js').query;
const redis = require('../model/db/index.js').redis;
const order = require('./putOrder.js');
const coupon = require('./coupon');
const jpush =require('../utils/jpush').jpush;
/*++++++++++++++++++++++++++++++++++++++++++++内置函数++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//【订单锁】对redis用户订单进行锁定 防止重复提交 L
let lockTemOrder = (that)=> {
    return new Promise((resolve)=> {
        let {fleetId,phoneNum}=that;
        redis.select(5);
        redis.eval(`
      local round1 = redis.call('hexists',KEYS[1],ARGV[1])
        if round1==0 then
         redis.call('hset',KEYS[1],ARGV[1],ARGV[2])
           return 0
         else
            return 1
            end
         `
            , 1, fleetId, phoneNum, 1, (qeer, result)=> {
                if (result == 0) {
                    resolve(true)
                } else {
                    resolve(false);
                }

            });
    });
};
//订单锁重置 当mysql操作失败时
let deLockTemOrder = (that)=> {
    let {fleetId,phoneNum}=that;
    redis.select(5);
    redis.eval(
        `
       return redis.call('hdel',KEYS[1],ARGV[1])
         `
        , 1,fleetId,phoneNum, (qeer, result)=> {
        })
};
//增加设置自动队列
let setTtl= (that,temorder)=>{
    redis.select(5);
    redis.eval(`
  local round=redis.call('LPUSH','queue@'..KEYS[1],ARGV[1])
  local round1=redis.call('llen','queue@'..KEYS[1])
  if round1 >=4 then
  return 1
  else
  return 0
  end
  `,1,that.fleetId,temorder,(qeer,result)=>{
        if(qeer){
            console.log(qeer);
        }else{
            console.log(result);
            if(result==1){
                order.autoOrder(that.fleetId)
                    .then();
            }else{

            }
        }
    });
};

//获取路线价格信息并计算价格

let getPriceOption = (that)=> {
    return new Promise(
        (resolve)=> {
            mysql(`SELECT sign_id,city_cost,city_recost ,automatic,default_distance FROM fleet LEFT JOIN fleet_city  ON  fleet.fleet_id = fleet_city.fleet_id
          LEFT JOIN fleet_option ON fleet.fleet_id=fleet_option.fleet_id  WHERE fleet.fleet_id = ?  AND start_city = ? AND end_city = ?`, [that.fleetId, that.startCity, that.endCity], (qerr, results, field)=> {
                if (results[0] == null || results == undefined) {
                    resolve(false);
                } else {
                    let distance = that.distance;
                    let {city_cost:cost,city_recost:recost,default_distance:dedistance,sign_id:signId,automatic:automatic}=results[0];
                    let price;
                    if (dedistance != 0) {
                        price = (cost + recost * (distance- dedistance))*Number(that.people);
                    } else {
                        price = cost;
                    }
                    resolve({signId, price, automatic});
                }
            })
        });
};
//执行订单入库
let insert = (that)=> {
    return new Promise((resolve)=> {
        mysql(`call creat_temorder(?,?,?,?,?,?,?,?,?,?,?,?,@id)`, [that.phoneNum.toString(), that.startCity.toString(), that.endCity.toString(), that.startPosition.toString(), that.endPosition.toString(), that.price.toString(), that.distance.toString(), that.fleetId.toString(), that.people.toString()
            ,that.startAddress.toString(),that.endAddress.toString(),that.notes.toString()],(qerr, results, field)=> {
                if (!qerr) {
                    resolve(results[0][0].this_temId);
                    //这里实现推送
                    jpush(`【订单提交】:成功，订单号为：${results[0][0].this_temId}`,'',['alias','C'+that.phoneNum.toString()],'C');
                } else {
                    console.log(qerr)
                    resolve(false);
                }
            });
    })
};


/*++++++++++++++++++++++++++++++++++++++++++++++++++导出方法如下++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//获取车队运营选项
exports.getFleetOption = (fleet, callback)=> {
    if(fleet==undefined){
        return   callback(false);
    }
    redis.select(5);
    redis.hget(`option:${fleet}`, 'automatic', (qeer, result)=> {
        callback(result);
    })
};
//用户提交订单并生成相应信息手动运营
//错误代码【...3】 1被订单锁拒绝 2.获取信息错误 3.执行插入失败
exports.submitorder = (that, callback)=> {
    lockTemOrder(that)
        .then((data)=> {
            if (data == false) {
                let error=[false,1];
                throw (error);
            }
        })
        .then(()=> {
            return getPriceOption(that)
        })
        .then((data)=> {
            if (data != false) {
                that.signId = data.signId;
                that.price = data.price;
                that.automatic = data.automatic;
                return insert(that);
            } else {
                deLockTemOrder(that);
                let error= [false, 2];
                throw (error);
            }
        })
        .then((data)=> {
            if (data == false) {
                deLockTemOrder(that);
                throw ([false,3]);
            } else {
                throw([data, 0])
            }

        }).catch((e)=>{
        callback(e);
    })




};



//用户提交订单并生成相应信息自动运营
exports.automitic=(that,callback)=>{
    lockTemOrder(that)
        .then((data)=> {
            if (data == false) {
                let error=[false,1];
                throw (error);
            }
        })
        .then(()=> {
            return getPriceOption(that)
        })
        .then((data)=> {
            if (data != false) {
                that.signId = data.signId;
                that.price = data.price;
                that.automatic = data.automatic;
                return insert(that);
            } else {
                deLockTemOrder(that);
                let error= [false, 2];
                throw (error);
            }
        })
        .then((data)=> {
            if (data == false) {
                deLockTemOrder(that);
                throw ([false,3]);
            } else {
                setTtl(that,data);
                throw([data, 0])
            }

        }).catch((e)=>{
        callback(e);
    })
};

exports.inquiry=(that,callback)=>{
  let promise=  new Promise((resolve)=>{
        mysql(`SELECT sign_id,city_cost,city_recost ,automatic,default_distance FROM fleet LEFT JOIN fleet_city  ON  fleet.fleet_id = fleet_city.fleet_id
    LEFT JOIN fleet_option ON fleet.fleet_id=fleet_option.fleet_id  WHERE fleet.fleet_id = ?  AND start_city = ? AND end_city = ?`, [that.fleetId, that.startCity, that.endCity], (qerr, results, field)=> {
            if(qerr){
                callback(false);
            }else{
                let distance = that.distance;
                let {city_cost:cost,city_recost:recost,default_distance:dedistance,sign_id:signId,automatic:automatic}=results[0];
                var price;
                if (dedistance != 0) {
                    price = (cost + recost * (distance- dedistance))*Number(that.people);
                } else {
                    price = cost;
                }
                resolve(price);
            }
    });
    });
    promise.then((cost)=>{
        coupon.inquiry(that.couponCode,(data)=>{
          if(data===false){
              callback(cost);
          }else{
              //计算优惠额度
            let   recost;
              switch (data[0][0]){
                  case  '-':
                      if(Number(data[1])>=cost)
                          console.log(data[0][1],9999999);
                     recost= cost - Number(data[0][1]);
                      break;
                  case  '*':
                      if(Number(data[1])>=cost)
                      recost= cost * Number(data[0].slice());
                      break
              }
              if(recost===undefined){
                  callback(cost);
              }
              callback(recost);
          }
        })
    })
};