"use strict";
var express = require('express');
var router = express.Router();
const login=require('../controller/web/login.js');
const  showpage=require('../controller/web/showpage.js');
const  driver=require('../controller/web/driver.js');
const  coupon=require('../controller/restful/coupon.js');
const  upload=require('../utils/upload');

/* GET coupon page */
router.get('/coupon/:user',coupon.getCoupon);

/* GET home page. */
//登陆
router.get('/login',showpage.login);
//登陆提交
router.post('/login',login.driverlogin);
//首页显示
router.get('/',showpage.index);
//我的车队页面
router.get('/myfleet',showpage.myfleet);
//车队选项
router.post('/driver/driveroption');
//创建车队
router.get('/createfleet',showpage.createfleet);
//提交车队创建
router.post('/createfleet',driver.createfleet);
//查看个人信息
router.get('/profile',showpage.profileInfo);
//个人的信息更新
router.post('/profile/info',driver.putUserInfo);
//驾驶证上传位置
router.post('/profile/license',upload.license.single('dri_license'),driver.putlicense);
//车辆信息上传
router.post('/photo/profile',upload.photo.single('car_photo'),driver.putphoto);
//驾驶证完成跳转
router.get('/profile/newlicense',(req,res)=>{
    req.session.blockplay=2;
    res.redirect('/profile');
});
//车辆信息上传跳转
router.get('/profile/newphoto',(req,res)=>{
    req.session.blockplay=3;
    res.redirect('/profile');
});
//order页面获得拼车单
router.get('/fleet/order',showpage.order);
//获得临时订单
router.get('/fleet/order/temorder',showpage.temorder);
//获得车队成员列表
router.get('/fleet/member',showpage.member);
//删除成员
router.get('/del/member/:user',driver.delmember);
//车队设置页面与路线
router.get('/fleet/option',showpage.fleetOption);
//删除已存在路线和选项
router.post('/fleet/route',driver.delRoute);
//添加车队路线
router.post('/newroute',driver.newRoute);

//用户退出
router.get('/drop',(req,res)=>{
    req.session.destroy();
   return  res.redirect('/');
});
router.get('/link',(req,res)=>{
    res.render('link',{});
});
//显示红包页面
router.get('/coupon',(req,res)=>{
   res.render('coupon',{
   })
});
router.get('/apidoc',(req,res)=>{
  res.render('api',{})
});

module.exports = router;
