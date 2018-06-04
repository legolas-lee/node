/**
 * Created by kreta on 2018/5/28.
 */
var db    = {};
const mysql = require('mysql');
const pool  = mysql.createPool({
    connectionLimit : 10,
    host:'192.168.50.120',
    user:'root',
    password:'whxhwjsgcp',
    database:'node'
});

db.query = function(sql, callback){

    if (!sql) {
        callback();
        return;
    }
    pool.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        };

        callback(null, rows, fields);
    });
}
module.exports = db;