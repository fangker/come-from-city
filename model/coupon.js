const coupons= require('../proxy/coupon');
class Coupon {
    //构造函数
    constructor({coupon,userPhone,orderId}){
        Object.assign(this,{coupon,userPhone,orderId})
    }

    postCoupon(callback){
    let {userPhone}=this;
    coupons.postCoupon(userPhone,(tryout)=>{
        callback(tryout);
    });
    }
    createCoupon(callback){
       let {userPhone,orderId}=this;
    coupons.creatCoupon(userPhone,orderId,(url)=>{
        callback(url);
    })

    }
    getCouponList(callback){
        let {userPhone}  =this;
     coupons.getCouponList(userPhone,(tryout)=>{
         callback(tryout);
     })
    }
}

module.exports = Coupon;