const Coupon=require('../../model/coupon');
exports.postCoupon=(req,res)=>{
   let coupon=new Coupon({userPhone:req.body.phonenum});
   coupon.postCoupon((result)=>{
       let data={
           error:0,
           status: 'success',
           data:null
       };
       if(result==false){
           data.status="error";
           data.error=218;
       }else{
           data.data=result;
       }
       res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
       res.end(JSON.stringify(data));
   })
};

exports.getCoupon=(req,res)=>{
let coupon=new Coupon({userPhone:req.params.user});
   coupon.getCouponList((data)=>{
      console.log(data);
       res.header("Access-Control-Allow-Origin", "*");
       let arr=data.split('#');
       arr.splice(0,3);
       res.json({
           algorithm:arr[0],
           prerequisite:arr[1],
           date:arr[2]
       });
       res.end();
   })
};

exports.creatCoupon=(req,res)=>{
   let coupon=new Coupon({userPhone:req.body.phonenum,orderId:req.body.orderid});
   coupon.createCoupon((result)=>{
       let data={
           error:0,
           status: 'success',
           data:null
       };
       if(result==false){
           data.status="error";
           data.error=218;
       }else{
           data.data=result;
       }
       res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
       res.end(JSON.stringify(data));
   })
};


exports.getCouponList=(req,res)=>{
    let coupon=new Coupon({userPhone:req.query.userphone});
    coupon.getCouponList((result)=>{
        let data={
            error:0,
            status: 'success',
            data:null
        };
        if(result.length==undefined){
            data.status="error";
            data.error=212;
        }else{
            data.data=result;
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
        res.end(JSON.stringify(data));
    })
};