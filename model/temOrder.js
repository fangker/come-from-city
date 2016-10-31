"use strict";
const order=require('../proxy/putTemOrder.js');
const checkUser=require('../utils/checkKey.js');
class Order{
    constructor({people,notes,phoneNum,startCity,endCity,fleetId,arrangeTime,couponCode,startTime,startPosition,endPosition,startAddress,endAddress,distance}){

        Object.assign(this,{people,notes,phoneNum,startCity,endCity,fleetId,arrangeTime,couponCode,startTime,startPosition,endPosition,startAddress,endAddress,distance});

    }
    //用户提交一个订单手动方法
    submitorder(callback){
        let That=this;
     order.submitorder(That,([status,code])=>{
         callback(status,code);
     })
    }
    //自动运营订单方法
    automitic(callback){
        let That=this;
        order.automitic(That,([status,code])=>{
            callback(status,code);
        })

    }
    //判断运营类型
   runMode(callback){
       let That=this;
       order.getFleetOption(That.fleetId,(option)=>{
         callback(option)
       })
   }
    inquiry(callback){
        let That=this;
       order.inquiry(That,(result)=>{
           callback(result)
       })
    }
}
module.exports=Order;