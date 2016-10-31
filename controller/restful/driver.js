"use strict";
let {Driver,Admin}  = require('../../model/driver.js');
let redis=require('../../model/db/index').redis;
//RestFull 司机登陆
exports.login=(req,res)=>{
    let adriver=new Driver({phoneNum:req.query.phonenum,passWord:req.query.password});
    adriver.loginRe((status,result)=>{
        let  data={
            error:0,
            status:"success",
            data:{
            }
        };
     if(status==false){
       data.error=212;
         data.status="false"
     }else{
         data.data.key=result.result;
         if(result.isAdmin==1){
             data.data.admin=1;
         }
         if(result.isAdmin==0){
             data.data.admin=0;
         }
     }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//RestFull司机注册
exports.register=(req,res)=>{
    let adriver=new Driver({phoneNum:req.body.phonenum,passWord:req.body.password});
    adriver.registerRe((status,result)=>{
        let  data={
            error:0,
            status:"success",
            data:{
            }
        };
      if(status==true){
    data.data.key=result;
      }else{
          data.status="error";
          data.error=222;
      }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));

})
};
//获取司机信息
exports.getDriver=(req,res)=>{
    //action:getdriver
    let auser=new Driver({phoneNum:req.query.phonenum});
    //用户key，用户账号
    auser.getDriver((result)=>{
        let data={
            status:"success",
            data:null
        };

     if(result==false){
             data.status="error";
             data.error="212";
         }

     else{
   data.data=result;
         }



        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//更新司机位置信息
exports.putPosition=(req,res)=>{
   let adriver=new Driver({phoneNum:req.body.phonenum,userKey:req.body.key});
    adriver.putPostion=req.body.position;
   adriver.updatePostion((results)=>{
       let data={
           error:0,
           status:"success"
       };

       if(results==true){

       }else{
             data.error=212;
            data.status="false";
       }

           res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
           res.end(JSON.stringify(data));

       }
   )


};
//获得司机位置
exports.getPosition=(req,res)=>{
    let adriver=new Driver({phoneNum:req.query.userphone,userKey:req.query.key});
    adriver.appoint=req.query.appoint;
    adriver.getPostion((result)=>{
    if(result==null||result==undefined){
     let data={
         error:0,
         status:"sccess"
     };
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    }
    })
};
//补充注册信息
exports.putInfo=(req,res)=>{
  let adriver=new Driver({phoneNum:req.body.phonenum,userKey:req.body.key});
    adriver.driverSex=req.body.driversex;
    adriver.driverName=req.body.drivername;
    adriver.driverNumber=req.body.drivernumber;
    adriver.driverIdentity=req.body.driveridentity;
    adriver.putInfo((result)=>{
        if(result){
            let data = {
                status:"success",
                message: "effective  request"
            };
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
            res.end(JSON.stringify(data));
        }else{
            let error = {
                status: "error",
                err_code: "212"
            };
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
            res.end(JSON.stringify(error));
        }
    })

};
//司机获取自身信息
exports.getOwnInfo=(req,res)=>{
   let adriver=new Driver({phoneNum:req.query.phonenum,userKey:req.query.key});
    adriver.getOwnInfo((result)=>{
        let data={
            error:0,
            status:"false",
            data:null
        };
   if(result==null ){
       data.error=222;
   }else if(result==false){
       data.error=212;
   }else{
       data.status="success";
       data.data=result[0];
   }
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
            res.end(JSON.stringify(data));
    }

    )
};

//管理获得历史订单
exports.getFleetTemOrder=(req,res)=>{
    let adriver=new Admin({phoneNum:req.query.phonenum,userKey:req.query.key});
    adriver.start=req.query.start;
    adriver.end=req.query.end;
    adriver.getFleetTemOrder((results)=>{
        let data={
            error:0,
            status:null,
            data:null
        };
        if(results==null){
        data.status="false";
            data.error=1;
        } else if(results==false){
            data.error=212;
            data.status=false;
        }else if(results.length!=0){
            data.status="success";
            data.data=results;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//司机获得历史拼车单
exports.getFleetOrder=(req,res)=>{
 let adriver=new Driver({phoneNum:req.query.phonenum,userKey:req.query.key});
    adriver.start=req.query.start;
    adriver.end=req.query.end;
   adriver.getFleetOrder((results)=>{
      let data={
          error:0,
          status:"success",
          data:null
      };
       if(results){
           data.data=results;
       }else{
           data.error=1;
           data.status="false";
       }
       res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
       res.end(JSON.stringify(data));
  })
};
//司机自动登录
exports.autoDriverLogin=(req, res)=>{
    let adriver=new Driver({phoneNum:req.query.phonenum,userKey:req.query.key});
    adriver.autoDriverLogin((result)=>{
    let data={
        error:0,
        status:"success"
    };
        if(result==false){
            data.error=212;
            data.status="false";
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//管理员获取车队订单
exports.getAllFleetOrder=(req,res)=>{
//管理获得车队历史订单
    let adriver=new Admin({phoneNum:req.query.phonenum,userKey:req.query.key});
    adriver.start=req.query.start;
    adriver.end=req.query.end;
     adriver.getAllFleetOrder((results)=>{
         let data={
             error:0,
             status:"success",
             data:null
         };
         if(results===false){
             data.error=212;
             data.status="false";
         }else{
             data.data=results
         }
         res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
         res.end(JSON.stringify(data));
     })
};
//管理员根据拼车单获得子订单
exports.getThisTemOrder=(req,res)=>{
    let adriver=new Driver({phoneNum:req.query.phonenum,userKey:req.query.key});
    adriver.orderid=req.query.orderid;
    adriver.getThisTemOrder((result)=>{
  let data={
      error:0,
      status:"success",
      data:null
   };
        if(result===false){
            data.error=212;
            data.status="false";
        }else {
            data.data=result
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//更改司机在线状态
exports.putDriverSituation=(req,res)=>{
    let adriver=new Driver({phoneNum:req.body.phonenum});
    adriver.fleetId=req.body.fleetid;
    adriver.situation=req.body.situation;
    adriver.putDriverSituation((result)=>{
        let data={
            error:0,
            status:"success",
            situation:null
        };
        if(result==false){
            data.error=216;
            data.status="false";
        }else{
            data.situation=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });
};
//获得司机在线状态
exports.getDriverSituation=(req,res)=>{
  let adriver=new Driver({phoneNum:req.query.phonenum});
    adriver.fleetId=req.query.fleetid;
    adriver.getDriverSituation((result)=>{
        let data={
            error:0,
            status:"success",
            data:{}
        };
        if(result==false){
            data.error=212;
            data.status="false";
        }else{
            data.data.situation=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//获得车队在线司机列表
exports.getAllOnlinePosition=(req,res)=>{
   let adriver=new Admin({phoneNum:req.body.phonenum});
    adriver.fleetId=req.query.fleetId;
    adriver.getAllOnlinePosition((result)=>{
    let data={
        error:0,
        status:"success",
        data:null
    };
        if(result===false){
            data.error=212;
            data.status="false";
        }else{
            data.data=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });

};
//司机申请加入车队
exports.postApplication=(req,res)=>{
    let adriver=new Driver({phoneNum:req.body.phonenum,fleetId:req.body.fleetid});
    adriver.postApplication((result)=>{
        let data={
             error:0,
             status:"success"
        };
    if(result==false){
      data.error=212;
        data.status="false";
    }else if(result==2){
            data.error=1;
            data.status="false"
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });
};
//司机获得申请状况
exports.getApplication=(req,res)=>{
    let adriver=new Driver({phoneNum:req.query.phonenum});
    adriver.getApplication((result)=>{
        let data={
            error:0,
            status:"success",
            data:{}
        };
        if(result==false){
            data.error=233;
            data.status="false";
        }else{
            data.data.ttl=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//管理员获得申请处理信息
exports.getFleetApplication=(req,res)=>{
let admin=new Admin({phoneNum:req.query.phonenum});
    admin.getFleetApplication((result)=>{
        let data={
            error:0,
            status:"success",
            data:null
        };
        if(result==false){
            data.error=218;
            data.status="false";
        }else{
            data.data=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));

    })
};
//管理员处理申请
exports.applicationHandel=(req,res)=>{
    let admin=new Admin({phoneNum:req.body.phonenum});
    admin.applyId=req.body.applyid;
    admin.option=req.body.option;
    admin.applicationHandel((result)=>{
        let data={
            error:0,
            status:"success",
            data:null
        };
        if(result==false){
            data.error=212;
            data.status="false";
        }else{
            data.data=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//订单分配管理
exports.orderDistribution=(req,res)=>{
    console.log(req.body);
   let admin=new Admin({phoneNum:req.body.phonenum});
    //临时订单数组
      admin.orderArray = JSON.parse(req.body.array);
      admin.driverNum = req.body.drivernum;
      admin.fleetId =req.body.fleetid;
      admin.orderDistribution((status)=>{
          let data={
              error:0,
              status:"success"
          };
      if(status==false){
        data.error=212;
          data.status="error"
      }else{

      }
          res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
          res.end(JSON.stringify(data));
      });





};
//管理员确认订单
exports.putFleetTemOrder=(req,res)=>{
    let admin=new Admin({phoneNum:req.body.phonenum});
    admin.temId=req.body.temid;
    admin.putFleetTemOrder((result)=>{
        let data={
            error:0,
            status:"success"
        };
        if(result==false){
            data.error=212;
            data.status="error"
        }else{

        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//发布公告信息
exports.postNotice=(req,res)=> {
    let admin = new Admin({phoneNum: req.body.phonenum});
    admin.notice = req.body.notice;
    admin.postNotice((results)=> {
            let data = {
                error: 0,
                status: "success",
                data: null
            };
            if (results == false) {
                data.error = 212;
                data.status = "error"
            } else {
                data.data = results
            }
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
            res.end(JSON.stringify(data));
        })
    };
//查看公告信息
exports.getNotice=(req,res)=>{
    let driver = new Driver({fleetId:req.query.fleetid,phoneNum: req.query.phonenum});
    driver.getNotice((results)=> {
        let data = {
            error: 0,
            status: "success",
            data: null
        };
        if (results == false) {
            data.error = 212;
            data.status = "error"
        } else {
            data.data = results
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//获得司机个人订单
exports.getOwnOrder=(req,res)=>{
    let driver = new Driver({phoneNum:req.query.phonenum});
    driver.getOwnOrder((results)=>{
        let data = {
            error: 0,
            status: "success",
            data: null
        };
        if (results == false) {
            data.error = 212;
            data.status = "error"
        } else {
            data.data = results
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//更新订单状态
exports.putOrderStatus=(req,res)=>{
let driver= new  Driver({phoneNum: req.body.phonenum});
    driver.orderId=req.body.orderid;
    driver.putOrderStatus((results)=>{
        let data = {
            error: 0,
            status: "success"
        };
    if(results===false){
        data.error = 212;
        data.status = "error"
    }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};
//获得所有成员
exports.getAllMember=(req,res)=>{
let  admin=new Admin({phoneNum: req.query.phonenum});
    admin.start=req.query.start;
    admin.end=req.query.end;
    admin.getAllMember((results)=>{
            let data = {
                error: 0,
                status: "success",
                data:null
            };
            if(results===false){
                data.error = 212;
                data.status = "error"
            }else{
                data.data=results;
            }
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
            res.end(JSON.stringify(data));
        })
};