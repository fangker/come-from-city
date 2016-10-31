"use strict";
const getPutInfo =require('../proxy/putInfo.js');
const getInfo =require('../proxy/getInfo.js');
const checkKey=require('../utils/checkKey');
class Fleet {
    //构造函数
    constructor({startPoint,endPoint}) {
        Object.assign(this, {startPoint,endPoint})
    }
    //获取区域间的车队信息
     getFitFellt(callback){
         let That={startPoint:this.startPoint,endPoint:this.endPoint,phoneNum:this.phoneNum};
       getPutInfo.getFitFleet(That,(tryout)=>{
          callback(tryout);
       })
     }
    //获得当前位置车队 REST
     getThisPosition(callback){
         let That={startPoint:this.startPoint,start:this.start,end:this.end};
        getInfo.definedInfo(That,(tryout)=>{
            callback(tryout);
        });
    };

    }
module.exports=Fleet;