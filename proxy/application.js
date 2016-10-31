
const{query,redis} =require('../model/db/index.js');
const jpush =require('../utils/jpush').jpush;
exports.postApplication=(that,callback)=>{
      let promise=new Promise((resolve)=>{
      query(`select fleet_id as fleetId From fleet where fleet_id =?`,[that.fleetId],(qeer,result,field)=>{
            if(!qeer){
                  if(result.length==0){
                        //不存在的请求
                return  callback(false);
                  }else{
                      query(`select driver_phone as phone  from driver where driver_admin = 1 and fleet_id=?`,[that.fleetId],(qeer,result,field)=>{
                            if(result!==[]){
                                jpush(`【成员申请】:${that.phoneNum}申请加入您的车队`,'',['alias','D'+result[0].phone.toString()],'D');
                                resolve(true);
                            }
                      });

                  }
            }else{
                return  callback(false);
            }

      })

      });
      promise.then((result)=>{
            redis.select(4);
            //匹配判断是否存在，若不存在执行添加，并设置TTL索引
            redis.eval(`
            local round1=redis.call('KEYS','apply:'..KEYS[1]..'*')
            if table.getn(round1)>0 then
                  return 2
            else
                  redis.call('set','apply:'..KEYS[1]..'@'..KEYS[2],1)
                  redis.call('EXPIRE','apply:'..KEYS[1]..'@'..KEYS[2],172800)
                  return 1
            end
            `,2,that.phoneNum,that.fleetId,(err,result)=>{
                  if(err){
                        callback(false)
                  }else {
                        if(result==2){
                              callback(2);
                        }else{
                              callback(1);
                        }
                  }
            })
      })
};

exports.getApplication=(that,callback)=>{
     redis.select(4);
      redis.eval(`
      local round1=redis.call('KEYS','apply:'..KEYS[1]..'@*')
           local round2 = redis.call('TTL',round1[1])
     return round2
      `,1,that.phoneNum,(err,result)=>{
            if(err){
                  callback(false)
            }else {
                  callback(result);
            }
      })
};

exports.getFleetApplication=(that,callback)=>{
      let promise=new Promise((resolve)=>{
            query(`SELECT fleet_id as fleetId FROM driver where driver_phone=? and driver_admin =1`
                ,[that.phoneNum],(qeer,result,field)=>{
                  if(!qeer){
                        if(result.length==0){
                              callback(null);
                        }else{
                            resolve(result[0].fleetId);
                        }
                  }else{
                        callback(false);
                  }

            });
      });
      promise.then((fleetid)=>{
            redis.select(4);
            redis.eval(`
            local round1=redis.call('KEYS','apply:'..'*@'..KEYS[1])
            local array={}
            for i=1,#round1 do
                  local strJson = round1[i]..'#'..redis.call('TTL',round1[i])
                  table.insert(array,strJson)
                end
             return array
            `,1,fleetid,(err,result)=>{
                  if(err){
                        callback(false);
                  }else{
                        callback(result);
                  }
            });
      })

};

exports.applicationHandel=(that,callback)=>{
    let promise=new Promise((resolve,reject)=>{
          query(`SELECT fleet_id as fleetId FROM driver where driver_phone=? and driver_admin =1`
              ,[that.phoneNum],(qeer,result,field)=>{
               if(qeer){
                     callback(false);
               }else{
                     if(that.applyId && that.option=='true'){
                           resolve(result[0].fleetId);
                     }else if(that.applyId &&that.option=='false'){
                           reject(result);
                     }else {
                           callback(false);
                     }

               }
              })
    });
    promise.then((fleetid)=>{
       query(`update driver set fleet_id =? where driver_phone=?`,[fleetid,that.applyId],(qeer,result,field)=>{
            if(qeer){
                  return callback(false)
            }else{
                  redis.select(4);
                  redis.eval(`
            local round1=redis.call('KEYS','apply:'..KEYS[1]..'@*')
             return   redis.call('del',round1[1])
            `, 1, that.applyId, (qeer, result)=> {
                        if(qeer){
                            console.log(qeer);
                              return callback(false);
                        }else{
                            jpush(`【申请车队】:恭喜您通过了审核,您成为ID:${fleetid}车队的一员`,'',['alias','D'+that.applyId.toString()],'D');
                              return callback(true);
                        }
                  })
            }
       });

    },(reject)=> {
                redis.select(4);
                redis.eval(`
            local round1=redis.call('KEYS','apply:'..KEYS[1]..'@*')
             return   redis.call('del',round1[1])
            `, 1, that.applyId, (qeer, result)=> {
                      if(qeer){
                            callback(false);
                      }else{
                          jpush(`【申请车队】:您没有通过ID:${fleetid}车队的审核`,'',['alias','D'+that.applyId.toString()]);
                            if(result==1)
                            callback(true);
                      }
                })
    })};



