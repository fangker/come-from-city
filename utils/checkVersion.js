const redis = require('../model/db/index.js').redis;
checkThisVersion =(v_key,callback)=>{

    if(v_key==false||v_key==null||v_key==undefined){
    }else{
        redis.select(5);
  redis.sismember('version',v_key,(error,results)=>{
      if(results==1){
        return  callback(true);
      }else{
       return  callback(false);
      }

  })
    }
};

function verror(res){
    let v_error={
        status:"error",
        error_code:202,
        error_message:"your version had abandoned"
    };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(v_error));
};

exports.checkVersion =(req,res,next)=>{
    if(req.query.v_key){
        return   checkThisVersion(req.query.v_key,(v_status)=>{
            console.log("version"+v_status);
            v_status==true ?    next() : verror(res);
        })
    }
    if(req.body.v_key){
      return  checkThisVersion(req.body.v_key,(v_status)=>{
          console.log("version"+v_status);
            v_status==true ?    next() : verror(res);
        })
    }
    verror(res);
};

