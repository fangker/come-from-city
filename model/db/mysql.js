"use strict";
const dbset=require('./dbset.js').mysql;
//这是MYSQL访问模块
const mysql =  require('mysql');
let pool =  mysql.createPool({
    host :dbset.host ,
    user : dbset.user,
    password: dbset.password,
    port: dbset.port,
    database: dbset.database
});
pool.getConnection((error)=>{
    if(error){
        //数据库连接建立失败
       throw new Error(`Mysql hsa an error—${error.message}`);
    }
}
);
let query=(sql,values,callback) =>{
    pool.getConnection((err,conn)=>{
        if(err){
            throw new Error(`Mysql hsa an error—${error.message}`);
        }else{
            conn.query(sql,values,(qerr,vals,fields) =>{
                //释放连接
                conn.release();

                callback(qerr,vals,fields);
            });
        }
    });
};
// conn可导出更多方法
var conn=(callback)=>{pool.getConnection(function (error,conn) {
    return callback(conn);
})};


exports.query=query;
exports.conn=conn;
