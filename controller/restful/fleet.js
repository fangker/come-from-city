"use strict";
const Fleet  = require('../../model/fleet.js');

//用户获得两城市间的车队
exports.getFitFellt=(req,res)=>{
  let afleet=new Fleet({startPoint:req.query.startPoint,endPoint:req.query.endPoint});
    afleet.phoneNum=req.query.userphone;
    afleet.getFitFellt((fleet)=>{
        let data={
            error:null,
            status: 'success',
            data:null
        };
        let refleet=fleet;
        //key错误
        if(fleet==null){
            delete data.data;
            data.status='error';
            data.error_code=212;
            data.error_message='Invalid key ';
        }else{
        data.data=refleet;
        data.num=refleet.length;
    }
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    })
};

//获得当前位置车队信息
exports.getThisPosition=(req,res)=>{
    let afleetInfo=new Fleet({startPoint:req.query.startpoint});
    afleetInfo.start=req.query.start;
    afleetInfo.end=req.query.end;
    afleetInfo.getThisPosition((results)=>{
        let data={
            error:0,
            status:"success",
            data:null
        };
        if(results==false){
            data.error=212;
            data.status="false";
        }else{
            data.data=results;
        }
        res.writeHead(200,{'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};