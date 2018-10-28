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
  collectionName: "test"
}

var url = `mongodb://${userCredentials['dbUser']}:${userCredentials['password']}@${mongo['host']}:${mongo['port']}/${mongo['dbName']}`

module.exports.FindAll = function (callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err)
            return
        }
        const dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).find({}).toArray(function(err, result) {
            if (err) {
                callback(err);
                return
            }
            callback(null, result)
            db.close()
        })
    })
}

module.exports.ForceDelete = function (body, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err)
            return
        }
        var dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).deleteMany({"name": body.query.name}, function(err, res) {
            if (err) {
                callback(err)
                return
            }
            callback(null, res)
            db.close()
        })
    })
}