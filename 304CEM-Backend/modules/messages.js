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

module.exports.AddToCollection = function (req, callback) {
    let insertObj = {
        name: req.body['recipe'],
        ingredients: req.body['ingredients'],
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

module.exports.FindSome = function (callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err)
            return
        }
        var dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).find({deleted: {$eq: false}}).toArray(function(err, result) {
        if (err) {
            console.log('Error')
            callback(err)
            return
        }
        callback(null, result)
        db.close()
        })
    })
}
  
module.exports.FindSomeByName = function (body, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err)
            return
        }
        var dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).find({"name" : {$regex : `.*${body.query.recipe}.*`}, deleted: {$eq: false}}).toArray(function(err, result) {
        if (err) {
            console.log('Error')
            callback(err)
            return
        }
        callback(null, result)
        db.close()
        })
    })
}

  module.exports.FindSomeByIngredients = function (body, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err)
            return
        }
        var dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).find({"ingredients" : {$regex : `.*${body.query.recipe}.*`}, deleted: {$eq: false}}).toArray(function(err, result) {
            if (err) {
                console.log('Error')
                callback(err)
                return
            }
            callback(null, result)
            db.close()
        })
    })
}
  
module.exports.UpdateByName = function (body, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            callback(err)
            return
        }
        var dbo = db.db(mongo['dbName']);
        dbo.collection(mongo['collectionName']).findOneAndUpdate({"name": body.query.name}, {$set: {deleted: true}}, function(err, res) {
            if (err) {
                callback(err)
                return
            }
            callback(null, res)
            db.close()
        })
    })
}