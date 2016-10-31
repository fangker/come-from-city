const{query,redis} =require('../model/db/index.js');
const jpush =require('../utils/jpush').jpush;

exports.orderDistribution=(that,callback)=>{
   let promise= new Promise((resolve)=>{
        query('INSERT INTO `order`(fleet_id,driver_phone) VALUES(?,?); ',[that.fleetId,that.driverNum],(qeer,result,field)=>{
            if(qeer){
                callback(false);
            } else{
                query('select max(`order_id`) as `order` from `order`',(qeer,result,field)=>{

                    if(qeer){
                        callback(false);
                    }else{
                        //这里推送给用户和司机
                        jpush(`【有新订单】:订单号为-${result[0].order}，请查看`,'',['alias','D'+that.driverNum.toString()],'D');
                        resolve(result);
                    }
                });
            }

        })
    });
   promise.then((data)=>{
       query(`update tem_order SET  order_status = 2 ,order_id = ? WHERE tem_id  in(${that.orderArray.toString()})`,[data[0].order],(qeer,result,field)=>{
            if(qeer){
                callback(false);
            }else{
                callback(true);
            }
       })
   })

};

exports.rejectOwnOrder=(that,callback)=>{
    query('update`order`  set order_status =0 where order_id=? ',[Number(that.orderId)],(qeer,result,field)=>{
        (qeer)
    ?callback(false)
    :callback(true)
});
};

exports.resolveOwnOrder=(that,callback)=>{
    query('update`order`  set order_status =1 where order_id=? ',[Number(that.orderId)],(qeer,result,field)=>{
        (qeer)
            ?callback(false)
            :callback(true)
    });
};

//更改订单司机
exports.putOrder=(that,callback)=>{
        new Promise((resolve)=>{
            query('update`order`  set order_status =0 ,driver_phone = ? WHERE order_id=? ',[that.toDriver,that.orderId],(qeer,result,field)=>{
                    (qeer)
                    ?callback(false)
                    :resolve(that.orderId)
            });
        })
            .then((orderId)=>{
                query('update `order`  set driver_phone = ?',[orderId],(qeer,result,field)=>{
                    (qeer)
                    ?callback(false)
                    :resolve(true);
                });
            })
};

//更改订单状态
exports.putOrderStatus=(that,callback)=>{
    let date=new Date();
 query('update `order` set  order_status =2,end_time =? where order_id=?',[date,that.orderId],(qeer,result,field)=>{
     (qeer)
         ?callback(false)
         :callback(true);
 })
};