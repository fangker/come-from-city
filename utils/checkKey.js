"use strict";
const redis = require('../model/db/index.js').redis;

let response=(res)=>{
    let error={
        error:213,
        status:"false"
    };
    res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
    res.end(JSON.stringify(error));
};


//Restful KEY 验证
exports.checkKey =(req,res,next)=>{
 if(req.query.userphone&&req.query.phonenum==undefined&&req.query.key){
     if(req.query.key==0){
         return next();
     }
      redis.select(3);
      redis.hget(req.query.userphone,"key",(err, reply)=>{
          if(reply == req.query.key){
              next();
          }else{
              response(res);
          }

      })
  }else if(req.body.userphone&&req.body.key){
     if(req.body.key){
         return next();
     }
      redis.select(3);
      redis.hget(req.body.key,"key",(err, reply)=>{
          if(reply == req.body.key){
              next();
          }else {
              response(res);
          }
      })
  }else if(req.body.phonenum && req.body.key ){
     if(req.body.key==0){
         return next();
     }
      redis.select(4);
      redis.hget(req.body.phonenum,"key",(err, reply)=>{
          console.log(reply,req.body.key);
          if(reply == req.body.key){
              next();
          }else{
              response(res);
          }
      })
  }else if(req.query.phonenum && req.query.key&&req.query.userphone==undefined){
     if(req.query.key==0){
         return next();
     }
      redis.select(4);
      redis.hget(req.body.key,"key",(err, reply)=>{
          if(reply == req.body.key){
              next();
          }else{
              response(res);
          }
      })
  }else if(req.query.userphone&&req.query.phonenum!=undefined&&req.query.key)
  {
      if(req.query.key==0){
          return next();
      }
      redis.select(3);
      redis.hget(req.query.userphone,"key",(err, reply)=>{
          if(reply == req.query.key){
              next();
          }else{
              response(res);
          }

      })
 }else{
      next();
  }
};