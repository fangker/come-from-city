"use strict";
const TemOrder = require('../../model/temOrder.js');
const Driver= require('../../model/driver.js').Driver;
const Admin= require('../../model/driver.js').Admin;
//用户提交订单
exports.submitorder = (req, res)=> {
console.log(req.body);
    //加载零时订单对象
    let aorder = new TemOrder({
        startAddress:req.body.startaddress,
        endAddress:req.body.endaddress,
        phoneNum: req.body.userphone,
        startCity: req.body.startcity,
        endCity: req.body.endcity,
        fleetId: req.body.fleetid,
        arrangeTime: Date.now(),
        couponCode: req.body.couponcode,
        startPosition: req.body.startposition,
        endPosition: req.body.endposition,
        notes:req.body.notes
    });
    aorder.distance = req.body.distance;
    aorder.people = req.body.people;
    //判断模式
    aorder.runMode((option)=> {
        if (option == null || option == false||option == 0) {
            if (option === false) {
                let error = {
                    status: 'error',
                    err_code: '212',
                    error_message: 'There are problems with param '                };
                res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
                res.end(JSON.stringify(error));
            } else {
                //手动运营模式
                aorder.submitorder((status, code)=> {
                    let data = {
                        status: 'success',
                        error: '0',
                        data: null

                    };
                    if (status == false && code == 1) {
                        data.status = 'false';
                        data.error = 213;
                    } else if (status == false && code == 2 || code == 3) {

                        data.status = 'false';
                        data.error = 214;
                    } else if (code == 0) {
                        data.data = {time: Date.now()};
                        data.data={orderid:status};
                    }
                    res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
                    res.end(JSON.stringify(data));
                })
            }


        } else {
            //自动运营模式
            aorder.automitic()
        }


    });


};

exports.inquiry= (req,res)=>{
    let aorder = new TemOrder({
        phoneNum: req.query.userphone,
        startCity: req.query.startcity,
        endCity: req.query.endcity,
        fleetId: req.query.fleetid,
        couponCode: req.query.couponcode,
        distance:req.query.distance,
        people:req.query.people
    });
    aorder.inquiry((result)=>{
        let data = {
            status: 'success',
            error: '0',
            cost: null
        };
        if(result===false){
            data.status = 'false';
            data.error = 218;
        }else if(result=='couponfalse'){
            data.status='false';
            data.error=219;
        }else{
            data.cost=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};


exports.rejectOwnOrder= (req,res)=>{
let adriver=new Driver({phoneNum:req.body.phonenum});
    adriver.orderId=req.body.orderid;
   adriver.rejectOwnOrder((result)=>{
       let data = {
           error: 0,
           status: 'success'
       };
    if(result===false) {
    data.status = "error";
    data.error = 212;
    }
       res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
       res.end(JSON.stringify(data));
   });

};

exports.resolveOwnOrder=(req,res)=>{
    let adriver=new Driver({phoneNum:req.body.phonenum});
    adriver.orderId=req.body.orderid;
    adriver.resolveOwnOrder((result)=>{
        let data = {
            error: 0,
            status: 'success'
        };
        if(result===false) {
            data.status = "error";
            data.error = 212;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });
};

exports.putOrder=(req,res)=>{
    let admin=new Admin({phoneNum:req.body.phonenum,toDriver:req.body.todriver});
    admin.orderId=req.body.orderid;
    admin.putOrder((result)=>{
        let data = {
            error: 0,
            status: 'success'
        };
        if(result===false) {
            data.status = "error";
            data.error = 212;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })

};
