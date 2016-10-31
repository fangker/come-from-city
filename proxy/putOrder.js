
const{query,redis} =require('../model/db/index.js');
//自动订单生成
exports.autoOrder=(fleetId)=>{
    return new Promise((resolve)=>{
        redis.LRANGE(`queue@${fleetId}`,0,3,(qeer,result)=>{
            query(`select * from tem_order where tem_id in (${result.toString()})`,(qeer,result,field)=>{
                if(qeer){
                    throw  error(`err`);
                }
                let people=0;
                let sign=0;
                for( let i=0;i<result.length;i++){
                    people+=result[i].people;
                    if(people<=4){
                        sign=i;
                        break;
                    }else if(people>4){
                        sign=i-1;
                        break;
                    }
                }
                resolve(sign);
            })
        })
    }
    )
    //从列表中移除数组中元素
    .then((sign)=>{
        redis.LRANGE(`queue@${fleetId}`,0,sign-1,(qeer,result)=>{
           if(!qeer){
               query(`update set order_id = ? where username =(${result.toString()})`,[fleetId],(qeer,result,field)=>{
                   if(qeer){
                       throw  error('err');
                   }else{
                       resolve(true);
                   }
               })
           }
        })
    }).catch((e)=>{
        return false;
    })
};

//手动订单生成
exports.Order=()=>{

};