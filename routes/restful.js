"use strict";
const fs=require('fs');
const express = require('express');
const router = express.Router();
const user = require('../controller/restful/user.js');
const fleet  = require('../controller/restful/fleet.js');
const driver  = require('../controller/restful/driver.js');
const order=require('../controller/restful/temOrder.js');
const common=require('../controller/restful/common.js');
const  coupon=require('../controller/restful/coupon.js');

//注册用户
router.post('/usercos/construction',user.regesterRe);
//验证用户
router.get('/usercos',user.loginRe);
// 重验证用户
router.put('/usercos', user.relogin);
//获取用户资料
router.get('/usercos/information',user.userInfoRe);
//获得城市之间的车队列表
router.get('/feelt/route',fleet.getFitFellt);
//注册司机
router.post('/driver/construction',driver.register);
//司机登陆
router.get('/driver',driver.login);
//(乘客)获取司机资料
router.get('/fleet/driver',driver.getDriver);
//乘客获得当前定位位置车队信息
router.get('/usercos/fleet/thisposition',fleet.getThisPosition);
//乘客提交订单
router.post('/order/constructor',order.submitorder);
//更新提交位置信息
router.put('/driver/position',driver.putPosition);
//乘客获得司机位置信息
router.get('/driver/position',driver.getPosition);
//司机完善信息
router.put('/driver/information',driver.putInfo);
//司机获得个人信息
router.get('/driver/information',driver.getOwnInfo);
//司机获取自身订单
router.get('/driver/order',driver.getOwnOrder);
//【公共】根据ID查看车队信息
router.get('/fleet/information',common.getOwnFleetInfo);
//获取车队的临时订单
router.get('/fleet/tmporder',driver.getFleetTemOrder);
//司机获取拼车单
router.get('/driver/fleet/order',driver.getFleetOrder);
//司机自动登录
router.get('/driver/autologin',driver.autoDriverLogin);
//乘客自动登录
router.get('/usercos/autologin',user.autoUserLogin);
//乘客提交订单评论
router.post('/usercos/comment',user.postComment);
//获取车队星级
router.get('/user/credit',common.getOwnFleetCredit);
//获取车队评论
router.get('/fleet/common',common.getFleetComment);
//管理员获取已分配订单
router.get('/fleet/order',driver.getAllFleetOrder);
//根据拼车单获得临时订单
router.get('/fleet/order/temorder',driver.getThisTemOrder);
//更改司机在线状态
router.put('/driver/situation',driver.putDriverSituation);
//获取司机在线状态
router.get('/driver/situation',driver.getDriverSituation);
//管理员获得车队在线信息
router.get('/fleet/driver/position',driver.getAllOnlinePosition);
//申请加入车队
router.post('/fleet/application',driver.postApplication);
//司机查看入队状况
router.get('/fleet/application',driver.getApplication);
//车队查看申请列表
router.get('/fleet/admin/application',driver.getFleetApplication);
//车队管理处理申请
router.put('/fleet/admin/application',driver.applicationHandel);
//用户获取自身订单信息
router.get('/usercos/order',user.getorder);
//用户修改密码
router.put('/usercos/password',user.forgetPassword);
//管理员分配订单
router.post('/fleet/order',driver.orderDistribution);
//用户获得一个红包
router.post('/coupon',coupon.postCoupon);
//用户发送一个红包
router.post('/linkcoupon',coupon.creatCoupon);
//用户查看自身红包列表
router.get('/usercos/coupon',coupon.getCouponList);
//用户询价接口
router.get('/order/inquiry',order.inquiry);
//司机拒绝接单接口
router.put('/driver/order/reject',order.rejectOwnOrder);
//司机接受订单
router.put('/driver/order/resolve',order.resolveOwnOrder);
//管理员修改重分配订单
router.put('/fleet/order',order.putOrder);
//管理员确认订单
router.put('/fleet/tmporder',driver.putFleetTemOrder);
//提交车队公告
router.post('/fleet/notice',driver.postNotice);
//查看车队公告
router.get('/driver/notice',driver.getNotice);
//结束订单
router.put('/driver/order/status',driver.putOrderStatus);
//获得所有车队成员
router.get('/fleet/member',driver.getAllMember);





module.exports = router;