"use strict";
const mysql=require('../model/db').query;
//对用户名密码等后台提交进行二次验证，减少恶意提交的服务压力
exports.chack=function([name,pass,...goon],callback) { //使用解构

    //计数
    let num=1;
    //Generator  乘客注册判断流程
    function* checkA() {
        let value1 = yield   checknameA();
    }
    var optionA=checkA();
    //Generator 司机注册规则判断流程
    console.log(optionA.next());
    function* checkB() {
        let value1 = yield checknameB();
        let value2 = yield checkpassword(value1);
    }
    var optionB=checkB();
    //方法：检查数据库乘客用户名是否存在
    function checknameA(){
        mysql('SELECT * FROM `user` WHERE `user_name`=?',[name],(qerr,results,fields)=>{
            if(results.length==0){
                ++num;
                optionA.next(true,num);
            }else{
             return   callback(false,num);
            }
        })
    }
    //方法：检查数据库司机注册是否存在
     function checknameB (){
        mysql('SELECT * From `driver` WHERE `driver_name`=?'[name],(qerr,results,fields) =>{
            if(results.length==0){
                ++num;
            }else {

            }
        })
    }
    //共有方法：密码情况查询
    let checkPassword = () =>{
        //待写入
    }

};




