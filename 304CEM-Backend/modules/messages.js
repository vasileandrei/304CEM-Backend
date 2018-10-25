'use strict'

var db = require('./database');

exports.add = function(conData, req, callback) {
    //first connect to DB
    db.connect(conData, function(err, con){
        //when done check for any error 
        if (err) {
            callback(err);
            return;
        }
        //if no error prepare our user object with the values sent by the client
        let message = {
            name: req.body['name'],
            email: req.body['email'],
            url: req.body['url'],
            message: req.body['message']
        }
        if (req.body['id'] !== undefined && req.body['id'] !== '') {
            message['id'] = req.body['id']
        }
        //perform the query 
        con.query('INSERT INTO Messages SET ?', message, function (err, result) {
            //return control to the calling module
            callback(err, message);
        })
    })
}

exports.getById = function(conData, req, callback) {
    db.connect(conData, function(err, data) {
        if (err) {
            callback(err)
            return
        }
        data.query(`SELECT * FROM Messages WHERE id = ${req.params.id}`, function (err, result) {
            let data = JSON.stringify(result, null, 2)
            callback(err, data)
        })
    })
}

exports.getAll = function(conData, req, callback) {
    db.connect(conData, function(err, data) {
        if (err) {
            callback(err)
            return
        }
        data.query('SELECT * FROM Messages',function (err, result) {
            let data = JSON.stringify(result, null, 2)
            callback(err, data)
        })
    })
}

exports.deleteById = function(conData, req, callback) {
    db.connect(conData, function(err, data) {
        if (err) {
            callback(err)
            return
        }
        data.query(`DELETE FROM Messages WHERE id = ${req.params.id}`, function (err, result) {
            let data = JSON.stringify(result, null, 2)
            callback(err, data)
        })
    })
}