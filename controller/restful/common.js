
const  getInfo=require('../../proxy/getInfo.js');
//共用获取车队信息
exports.getOwnFleetInfo=(req,res)=>{
    getInfo.getOwnFeelInfo(req.query.fleetid,(result)=>{

        if(result==false){
            let data={
                error:0,
                status:"false",
                data:null
            };
            data.error = 212;
            data.status=false;
        }else{
            data=result
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    });
};
exports.getOwnFleetCredit=(req,res)=>{
    getInfo.getOwnCredit(req.query.fleetid,(result)=>{
        let data={
            error:0,
            status:"success",
            data:null
        };

        if(result==false){
            data.error=212;
            data.status="false"
        }else{
            data.data=result
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));


    })
};
//获取车队评论
exports.getFleetComment=(req,res)=>{
   getInfo.getFleetComment(req.query.fleetid,req.query.start,req.query.end,(result)=>{
       let data={
           error:0,
           status:"success",
           data:null
       };
       if(result==null){
           data.error=212;
           data.status="false"
       }else{
           data.data=result
       }
       res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
       res.end(JSON.stringify(data));
   })
};