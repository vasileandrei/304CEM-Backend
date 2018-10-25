'use strict'

const mysql = require('mysql');

exports.connect = function(conData, callback){
    var con = mysql.createConnection({
        host: conData.host,
        user: conData.user,
        password: conData.password,
        database: conData.database
    })
    con.connect(function(err) {
        if (err) callback(err);
        callback(null, con);
    })
}

module.exports.createTables = function(conData ,callback) {
    const con = mysql.createConnection({
        host: conData.host,
        user: conData.user,
        password: conData.password,
        database: conData.database
    })
    const sql = "CREATE TABLE Messages (id INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(30), url VARCHAR(30), message VARCHAR(4096))"
    con.query(sql, function(err, result) {
        console.log('finish query: ' + result)
        callback(err, result)
    })
}

module.exports.dropTables = function(conData ,callback) {
    const con = mysql.createConnection({
        host: conData.host,
        user: conData.user,
        password: conData.password,
        database: conData.database
    })
    const sql = "DROP TABLE Messages"
    con.query(sql, function(err, result) {
        console.log('finish query: ' + result)
        callback(err, result)
    })
}