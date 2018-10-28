'use strict'

var MongoClient = require('mongodb').MongoClient

const userCredentials = {
    dbUser: "vasilea2",
    password: "Vasile.1010"
}

const mongo = {
    host: "ds141813.mlab.com",
    port: "41813",
    dbName : "mymongodb",
    collectionName: "users"
}

var url = `mongodb://${userCredentials['dbUser']}:${userCredentials['password']}@${mongo['host']}:${mongo['port']}/${mongo['dbName']}`

module.exports.Register = function (req, callback) {
    let insertObj = {
        name: req.body['username'],
        password: req.body['password'],
        email: req.body['email'],
        deleted: false
    }
    if (req.body['id'] !== undefined && req.body['id'] !== '') {
        insertObj['_id'] = req.body['id']
    }
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err);
            return
        }
        var dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).insertOne(insertObj, function(err, res) {
            if (err) {
                callback(err);
                return
            }
            callback(null, res)
            db.close();
        })
    })
}