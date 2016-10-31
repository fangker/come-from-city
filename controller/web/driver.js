const model = require('../../model/driver.js');
const Driver = require('../../model/driver.js').Driver;
//修改个人信息
exports.putUserInfo = (req, res)=> {
    let data = {
        driverName: req.body.username,
        driverSex: req.body.sex,
        driverIdentity: req.body.driveridentity,
        driverNum: req.body.drivernum,
        driverType: req.body.drivertype,
        user: req.session.user
    };
    model.Driver.putUserInfo(data, (results)=> {
        (results == false)
            ? req.session.message = "输入的信息有错误"
            : req.session.message = "您提交的信息更新成功";
        res.redirect('/profile');
    })

};
//创建车队
exports.createfleet = (req, res)=> {
    if (!req.session.user) {
        return res.redirect('/');
    }
    data = {
        fleetName: req.body.fleetname,
        fleetPhone: req.body.fleetphone,
        fleetInfo: req.body.fleetinfo,
        user: req.session.user

    };
    model.Driver.createFleet(data, (results)=> {
        if (results == false) {
            //错误
        } else {
            req.session.fleetid = results;
            res.redirect('/myfleet');
        }
    })

};
//提交驾驶证信息
exports.putlicense = (req,res)=>{
    model.Driver.putlicense(req.file.filename,req.session.user,(status)=>{
        if(status==true){
            res.end(JSON.stringify({status:true}));
        }else{
            res.end();
        }

    });

};
//提供车辆照片
exports.putphoto = (req,res) => {
    model.Driver.putphoto(req.file.filename,req.session.user,(status)=>{
        if(status==true){
            res.end(JSON.stringify({status:true}));
        }else{
            res.end();
        }
    });
};
//删除成员
exports.delmember=(req,res) =>{
   model.Driver.delmember(req.session.user,req.body.member,(status)=>{
       if(status==true){
           res.end(JSON.stringify({status:true}));
       }else{
           res.end(JSON.stringify({status:false}));
       }
   })
};
//删除路线
exports.delRoute=(req,res)=>{
    Driver.delRoute(req.session.user,req.body.route,(status)=>{
        if(status==true){
            res.end(JSON.stringify({status:true}));
        }else{
            res.end(JSON.stringify({status:false}));
        }
    })
};
//新增路线
exports.newRoute=(req,res)=>{
    let That={
        startCity:req.body.startcity,
        endCity:req.body.endcity,
        cityCost:req.body.citycost,
        cityreCost:req.body.cityrecost,
        distance:req.body.distance,
        fleetId:req.session.fleetid
    };
   model.Driver.newRoute(That,result=>{
    (result==true)
        ?req.session.message="增加成功"
        :req.session.message="参数出现错误";
    res.redirect('/fleet/option');
   })
};
