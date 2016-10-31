"use strict";
const checkversion=require('../../proxy/getInfo.js');
exports.checkVersion=(req,res)=>{
checkversion.checkVersion(req.query.version,(current,result)=>{
    let data={
        error:0,
        current:current,
        result:result
    };
    if(current==false){
        data.current=null;
        data.result=null;
        data.error=212;
    }
    res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
    res.end(JSON.stringify(data));
});
};