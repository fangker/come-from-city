"use strict";

//mysql 封装query 导出
exports.query = require('./mysql.js').query;
//到处conn方法 如果需要
exports.conn =require('./mysql.js').conn;

// redis.client导出
exports.redis = require('./redis.js');
