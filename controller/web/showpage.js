const getInfo = require('../../proxy/getInfo.js');
//首页
exports.index = (req, res)=> {
    res.render('index.jade', {title:"城来城往-让出行变的更加简单",user: req.session.user, username: req.session.username,admin:req.session.admin})
};
//我的车队
exports.myfleet = (req, res)=> {
    if(req.session.user){
        getInfo.getMyFleetInfo(req.session.user, (data)=> {
            res.render('myfleet.jade', {title:"我的车队",username:req.session.username,user: req.session.user, fleetname: data[0].fleetName,fleetphoto:data[0].fleetPhoto,
                fleetinfo:data[0].fleetInfo,fleetphone:data[0].fleetPhone,fleetid:data[0].fleetId,admin:req.session.admin})
        })
    }else{
        res.redirect('/')
    }

};
//创建车队
exports.createfleet = (req, res)=> {
    if(req.session.fleetid!=null){
        return   res.redirect('/')
    }
    res.render('createfleet.jade', {title:"创建车队",user: req.session.user, username: req.session.username,admin:req.session.admin})
    res.session.message=null;

};
//个人信息
exports.profileInfo=(req,res)=>{
    if(!req.session.user){
        //
    }else{
        getInfo.profileInfo(req.session.user,(data)=>{
            res.render('profileInfo.jade', {title:"查看个人信息",user: req.session.user,admin:req.session.admin, username: req.session.username,
                driverlicense:data[0].driverLicense,driverphoto:data[0].driverPhoto,drivertype:data[0].driverType,driveridentity:data[0].driverIdentity,
                driversex:data[0].driverSex,drivernumber:data[0].driverNumber,message:req.session.message,blockplay:req.session.blockplay})
            req.session.blockplay=null;
        })
    }
};
//登录页面
exports.login=(req,res)=>{
    res.render('login.jade',{title:"登录"});
};
//订单信息查看
exports.order=(req,res)=>{
    getInfo.getOrder(req.session.fleetid,(data)=>{
        res.render('order.jade',{data:data,admin:req.session.admin,user: req.session.user,username: req.session.username})
    });
};
//临时根据拼车单查看
exports.temorder=(req,res)=>{
    getInfo.getTemOrder(req.query.orderid,(data)=>{
        res.json(data);
        res.end();
    })
};
//车队成员信息
exports.member=(req,res)=>{
    getInfo.getMember(req.session.fleetid,(data)=>{
        res.render('member.jade',{data:data,admin:req.session.admin,user: req.session.user,username: req.session.username})
    })
};
//车队信息选项路线
exports.fleetOption=(req,res)=>{
    getInfo.fleetOption(req.session.user,(data)=>{
        res.render('option.jade',{data:data,admin:req.session.admin,message:req.session.message,user: req.session.user,username: req.session.username})
    });
};