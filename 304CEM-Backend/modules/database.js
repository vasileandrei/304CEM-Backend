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

module.exports.CreateCollection = function (body, callback) {
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) {
      callback(err)
      return
    }
    var dbo = db.db(mongo['dbName'])
    dbo.createCollection(body.query.colName, function(err, res) {
      if (err) {
        callback(err)
        return
      }
      callback(null, res)
      db.close()
    })
  })
}

module.exports.DropCollection = function (body, callback) {
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) {
      callback(err)
      return
    }
    var dbo = db.db(mongo['dbName'])
    dbo.dropCollection(body.query.colName, function(err, res) {
      if (err) {
        callback(err)
        return
      }
      callback(null, res)
      db.close()
    })
  })
}