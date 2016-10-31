"use strict";
const  Reg=require('../proxy/logAndReg.js');
const  getPutInfo=require('../proxy/putInfo.js');
const  getInfo=require('../proxy/getInfo.js');
const  application=require('../proxy/application');
const  order = require('../proxy/order.js');
class Driver {
    //构造函数
    constructor({userName,passWord,phoneNum,permitId,userKey,fleetId}){
        Object.assign(this,{userName,passWord,phoneNum,permitId,userKey,fleetId})
    }
    //构造对象
    //司机注册WEB
    register(callback){
        Reg.driverRegister(this,(qerr, result)=>{
            callback(qerr,result);
        })

    }
    //司机登陆REST
    loginRe(callback){
        let That={phoneNum:this.phoneNum,passWord:this.passWord};
        Reg.driverLoginRe(That,(status,result)=>{
            let reresults;
            if(status==true){
                 reresults={
                    result:result.stamp,
                    isAdmin:result.isAdmin
                };
            }else{
                reresults=null;
            }


          callback(status,reresults);
        })
    }
    //司机注册REST
    registerRe(callback){
        Reg.driverRegisterRe(this,(status, result)=>{
            callback(status,result);
        })
    }
    //用户获取司机信息REST
    getDriver(callback){
        let That={driverphone:this.phoneNum};
        getPutInfo.getDriver(That,(tryout)=>{
            callback(tryout)
        })
        };
    //更新位置信息
    updatePostion(callback){
        let That=this;
       getPutInfo.putDriverPostion(That,(tryout)=>{
            callback(tryout);
        })
    }
    //获得司机位置信息
    getPostion(callback){
        let That={phoneNum:this.phoneNum,userKey:this.userKey,appoint:this.appoint};
        getPutInfo.getDriverPostion(That,(tryout)=>{
            callback(tryout);
        })
    }
   //补充住注册信息
    putInfo(callback){
     let That={phoneNum:this.phoneNum,userKey:this.userKey,driverSex:this.driverSex,driverName:this.driverName,driverIdentity:this.driverIdentity,driverNumber:this.driverNumber};
       getPutInfo.putDriverInfo(That,(tryout)=>{
               callback(tryout);
        })
    }

    //司机登陆WEB
    login(callback){
        let That={phoneNum:this.phoneNum,passWord:this.passWord};
        Reg.driverLogin(That,(result)=>{
            callback(result);
        })
    }
    //司机获取自身信息
    getOwnInfo(callback){
        let That={phoneNum:this.phoneNum,userKey:this.userKey};
        getInfo.getOwnInfo(That,(tryout)=>{
            callback(tryout);
        });
    }
    //自动司机登录
    autoDriverLogin(callback){
        let That={phoneNum:this.phoneNum,userKey:this.userKey};
         Reg.autoDriverLogin(That,(tryout)=>{
             callback(tryout);
         })
    }
    //司机获得自身订单
    getFleetOrder(callback){
        let That={phoneNum:this.phoneNum,userKey:this.userKey,start:this.start,end:this.end};
        getInfo.getFleetOrder( That,(tryout)=>{
            callback(tryout);
        });

    }
    //补充个人信息
    static putUserInfo(data,callback){
        getPutInfo.putUserInfo(data,(result)=>{
       callback(result);
        })
    }
    static createFleet(data,callback){
        getPutInfo.createFleet(data,(result)=>{
       callback(result);
        });
    }
    //由拼车单获得子订单
     getThisTemOrder(callback){
         let That={phoneNum:this.phoneNum,orderId:this.orderid};
        getInfo.getThisTemOrder(That,(data)=>{
            callback(data);
        })
    }
    //改变在线信息
     putDriverSituation(callback){
       let  That={phoneNum:this.phoneNum,fleetId:this.fleetId,situation:this.situation};
       getPutInfo.putDriverSituation(That,(data)=>{
           callback(data);
       })
    }
    getDriverSituation(callback){
        let That={phoneNum:this.phoneNum,fleetId:this.fleetId};
        getInfo.getDriverSituation(That,(data)=>{
                callback(data);
        })
    }
//提交加入申请
    postApplication(callback){
     let That={phoneNum:this.phoneNum,fleetId:this.fleetId};
     application.postApplication(That,(data)=>{
     callback(data);
     })
    }
//查询申请概况
    getApplication(callback){
        let That={phoneNum:this.phoneNum};
        application.getApplication(That,(data)=>{
            callback(data);
        })
    }
//提交license
    static putlicense(filename,user,callback){
        getInfo.putlicense(filename,user,(data)=>{
            callback(data);
        })
    }
//提交车辆照片信息
    static putphoto(filename,user,callback){
        getInfo.putphoto(filename,user,(data)=>{
            callback(data);
        })
    }
//删除一个车队成员
    static delmember(adminId,member,callback){
        getInfo.delMember(adminId,member,(data)=>{
            callback(data);
        })
    }
//删除一个路线
    static delRoute(adminId,router,callback){
        getInfo.delRoute(adminId,router,(data)=>{
            callback(data);
        })
    }
//增加一条路线
    static newRoute(that,callback){
        getPutInfo.newRoute(that,(tryout)=>{
            callback(tryout);
        })
    }
//司机退回订单
    rejectOwnOrder(callback){
       let  That={phoneNum:this.phoneNum,orderId:this.orderId};
        order.rejectOwnOrder(That,(tryout)=>{
           callback(tryout);
       })
    }
    getOwnOrder(callback){
        let That={phoneNum:this.phoneNum};
        getInfo.getOwnOrder(That,(tryout)=>{
             callback(tryout);
        });
    }
//司机接单同意
    resolveOwnOrder(callback){
        let  That={phoneNum:this.phoneNum,orderId:this.orderId};
        order.resolveOwnOrder(That,(tryout)=>{
            callback(tryout);
        });

    }
    //获得公告
    getNotice(callback){
        let That={phoneNum:this.phoneNum,fleetId:this.fleetId};
        getPutInfo.getNotice(That,(tryout)=>{
            callback(tryout);
        });
    }
    //更改订单状态
    putOrderStatus(callback){
        let  That={phoneNum:this.phoneNum,orderId:this.orderId};
        order.putOrderStatus(That,(result)=>{
            callback(result)
        });
    }
}
  class Admin extends Driver {
    constructor({userName,passWord,phoneNum,permitId,userKey,fleetId,toDriver}) {
        //直接调用父类构造器进行初始化
        super({userName,passWord,phoneNum,permitId,userKey,fleetId,toDriver});
    }
      //管理获得车队临时订单
      getFleetTemOrder(callback){
          let That={phoneNum:this.phoneNum,userKey:this.userKey,start:this.start,end:this.end};
          getInfo.getFleetTemOrder(That,(tryout)=>{
           callback(tryout);
          })
      }
      //管理员确定订单
      putFleetTemOrder(callback){
          let That={phoneNum:this.phoneNum,temId:this.temId};
          getPutInfo.putFleetTemOrder(That,(tryout)=>{
              callback(tryout)
          })
      }
      //管理员获得车队成员列表
      getAllMember(callback){
          let That={phoneNum:this.phoneNum,start:this.start,end:this.end};
          getInfo.getAllMember(That,(tryout)=>{
              callback(tryout)
          })
      }

      //管理员获得临时拼车单
      getAllFleetOrder(callback){
      let That={phoneNum:this.phoneNum,userKey:this.userKey,start:this.start,end:this.end};
          getInfo.getAllFleetOrder(That,(tryout)=>{
              callback(tryout);
          })
      }
      //获得所有车队在线司机位置
      getAllOnlinePosition(callback){
          let That={fleetId:this.fleetId};
          getInfo.getAllOnlinePosition(That,(tryout)=>{
            callback(tryout)
          })
      }
      //获得车队申请
      getFleetApplication(callback){
          let That={phoneNum:this.phoneNum};
          application.getFleetApplication(That,(tryout)=>{
              callback(tryout);
          })
      }
      //处理车队申请
      applicationHandel(callback){
          let That={phoneNum:this.phoneNum,applyId:this.applyId,option:this.option};
          application.applicationHandel(That,(tryout)=>{
              callback(tryout)
          })
      };
      orderDistribution(callback){
        let That={phoneNum:this.phoneNum,orderArray:this.orderArray,driverNum:this.driverNum,fleetId:this.fleetId};
          order.orderDistribution(That,(tryout)=>{
              callback(tryout);
          })
      };
      putOrder(callback){
          let That={phoneNum:this.phoneNum,toDriver:this.toDriver};
          order.putOrder(That,(tryout)=>{
              callback(tryout);
          })
      }
      postNotice(callback){
          let That={notice:this.notice,phoneNum:this.phoneNum};
          getPutInfo.postNotice(That,(tryout)=>{
              callback(tryout);
          })
      }

}

exports.Driver=Driver;
exports.Admin=Admin;
