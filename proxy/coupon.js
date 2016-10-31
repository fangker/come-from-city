const{query,redis} =require('../model/db/index.js');



exports.postCoupon=(userphone,callback)=>{
        redis.select(0);
        redis.eval(`
    local t =redis.call('keys','coupon@*')
    local index = math.random(1,#t)
    local coupon= redis.call('hvals',t[index]);
    local stamp=tonumber(coupon[5]*86400)+tonumber(${Date.parse(new Date())/1000})
    local subCoupon= 'subCoupon'..'#'..'${userphone}'..'#'..t[index]..'#'..coupon[1]..'#'..coupon[4]..'#'..stamp
    redis.call('set',subCoupon,coupon[2])
    return subCoupon
        `,0,(qeer,result)=>{
            (qeer)
            ?callback(qeer)
            :callback(result)
            })
};
//获得用户红包
exports.getUserCoupon=(userphone,callback)=>{
    redis.select(0);
    redis.eval(`
    local coupon= redis.call('keys','subCoupon#${userphone}*');
    return redis.call('time')[1]
        `,0,(qeer,result)=>{
        (qeer)
            ? callback(false)
            : callback(result)
    })
};
//发出一个红包
exports.creatCoupon=(userphone,orderId,callback)=>{
    redis.select(0);
    redis.eval(`
    local t =redis.call('keys','coupon@*')
    local index = math.random(1,#t)
     local coupon= redis.call('hvals',t[index]);
     local linkCoupon= "linkCoupon#${userphone.toString()}#${orderId.toString()}"
     redis.call('set',linkCoupon,coupon[2]);
     redis.call('expire',linkCoupon,coupon[5]);
    return linkCoupon
        `,0,(qeer,result)=>{
         (qeer)
        ?callback(false)
        :callback(result)
    })
};
//询优惠券码
exports.inquiry=(coupon,callback)=>{
    redis.select(0);
  redis.eval(`
  local coupon= redis.call('hvals','coupon@${coupon.toUpperCase()}')
  return coupon
  `,0,(qeer,results)=>{
      if(results.length>1){
          let array=[];
          array.push(results[0]);
          array.push(results[3]);
          callback(array);
      }else{
          callback(false);
      }
  });
};
exports.getCouponList=(userphone,callback)=>{
    redis.select(0);
    redis.eval(`
    local t =redis.call('keys','coupon@*')
    local index = math.random(1,#t)
    local coupon= redis.call('hvals',t[index]);
    local stamp=tonumber(coupon[5]*86400)+tonumber(${Date.parse(new Date())/1000})
    local subCoupon= 'subCoupon'..'#'..'${userphone}'..'#'..t[index]..'#'..coupon[1]..'#'..coupon[4]..'#'..stamp
    redis.call('set',subCoupon,coupon[2])
    return subCoupon
    `,0,(qeer,result)=>{
         (qeer)
             ?callback(false)
             :callback(result)
    })

} ;