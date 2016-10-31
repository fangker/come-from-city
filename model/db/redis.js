"use strict";
var dbset=require('./dbset.js').redis;
//这里是Redis访问模块
var Redis=require('redis');

var client  = Redis.createClient(dbset.port, dbset.host);
client.on("error", (error) =>{
    throw new Error(`Redis hsa an error—${error.message}`);
});

module.exports=client;

