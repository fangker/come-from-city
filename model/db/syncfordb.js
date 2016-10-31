"use strict";
const{query,redis} =require('./index.js');
//进行城市列表缓存
const insyncOfcity=()=>{query('SELECT * FROM `city`',(qerr,results,fields)=>{
    redis.select(2);
    process.nextTick(()=>{
        for(let i=0;i<results.length;i++){
            redis.set(results[i].city_id,results[i].city_name,(err,repley)=>{
                if(i==results.length-1) {
                    console.info(`REDIS Message: ${results.length} city_code has loaded in db-2`);
                }
            })
        }
    })
})};
//进行城市对应查找
const  transform=(cityid,callback)=>{
    redis.select(2);
    redis.get(cityid,(qerr,results,fields)=>{
        callback(results);
    })
    };
const insyncVersion=()=>{(query('SELECT * FROM `edition` WHERE `opened`= 1 ',(qeer,results,field)=>{
    let array=[];
    for(let i of results ){
        array.push(i.edition_key);
    }

     if(results.length==0){
          throw new Error('edition table failed to load ');
      }else{
          redis.select(5);
          redis.sadd('version',[...array],(qeer,results)=>{
              console.info(`REDIS Message: ${array.length} version loaded in db-5`);
          })
      }



}))};
//集合缓存司机开放状态
/*const insyncOfdriver=query('SELECT driver_phone, driver_name, driver_status, fleet_id From  Driver ORDER BY `fleet_id` ',(qerr,results,fields)=>{

    redis.select(1);
    for(let i=0;i<results.length;i++){
        redis.hmset(results[i].fleet_id,results[i].driver_phone,JSON.stringify(results[i]),(error,reply)=>{
            if(i==results.length-1){
           console.info(`REDIS Message: ${results.length} drivers has loaded in db-1`);
            }
    })
    }
});*/
//车队选项缓存
let insyncOffleet=()=>{query('SELECT * FROM `fleet_option` ',(qeer,results,fields)=>{
   redis.select(5);
    for(let i=0;i<results.length;i++){
        redis.hmset(`option:${results[i].fleet_id}`,'automatic',results[i].automatic,(error,reply)=>{
            if(i===results.length)
            console.info(`REDIS Message: ${results.length} fleet_option has loaded in db-4`);
        })
    }
})};
//缓存优惠券信息
let insyncCoupon=()=>{
    let promise=new Promise((resolve)=>{
        query('SELECT * FROM `coupon`',(qeer,results,field)=>{
            const stamp=new Date().getTime();
            let couponArray=[];
            for (let i of results){
                if(Date.parse(i.expiry)>stamp){
                    i.expiry= i.expiry-stamp;
                    couponArray.push(i);
                }
            }
            resolve(couponArray);
        })
    })
    //备注:尝试使用脚本存储
    .then((couponArry)=>{
        redis.select(0);
       for(let that of couponArry){
           redis.hmset(`coupon@${that.coupon}`,`algorithm`,that.algorithm,`live`,that.live,`prerequisite`,that.prerequisite,`expiry`,that.expiry
           ,`number`,that.number,(qeer,result)=>{
               if(qeer){
                   console.log(qeer)
               }else{
                   redis.expire(`coupon@${that.coupon}`,that.expiry,(qerror,results)=>{
                       if(qerror){
                        console.log(qerror)
                       }else{

                       }
                   })
               }
               }
           )
       }
    })

};


exports.insyncOfcity=insyncOfcity;
exports.insyncVersion=insyncVersion;
exports.insyncOffleet=insyncOffleet;
exports.transform=transform;
exports.insyncCoupon=insyncCoupon;


