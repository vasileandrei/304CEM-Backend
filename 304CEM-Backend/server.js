#!/usr/bin/env node

'use strict'

// import dependencies (npm install <name>)
const express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'})    // render main.handlebar
const bodyParser = require('body-parser');

// Custom modules
const db = require('./modules/database')
const messages = require('./modules/messages')
const admin = require('./modules/admin')
const user = require('./modules/user')

// initiate application using express and set listening port
const server = express(); 
const port = 8080;

// import directories
server.use(express.static('public'))
server.use(express.static('css'))

// using express engine and the handlebar views
server.engine('handlebars', handlebars.engine)
server.set('view engine', 'handlebars')
server.use(bodyParser.urlencoded({ extended: false }));

// foundation route
server.get('/', (req, res) => {res.render('home')})

server.post('/register', (req, res) => {
    // if (req.body['password'] !== req.body['checkPassword'])
    user.Register(req, function(err, data) {
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET', 'POST')
        if (err) {
            res.status(400)
            res.end('error: ' + err)
        }
        if (data.result.ok === 1) res.status(201)
        else console.log('Something went wrong adding: ' + JSON.stringify(req.body, null, 2))
        res.send('Successfully added')
    })
})

server.get('/api/v1/messages', (req, res) => {
    if(req.query !== undefined && req.query.recipe !== undefined) {
        if (req.query.searchOption === "name"){
            console.log('Search by name: ', req.query.recipe)
            messages.FindSomeByName(req, function(err, data) {
                res.setHeader('content-type', 'application/json')
                res.setHeader('accepts', 'GET', 'DELETE')
                if (err) {
                    res.status(400)
                    res.end('error: ' + err)
                }
                res.status(201)
                res.send(data)
            })
        } else if (req.query.searchOption === "ingredients"){
            console.log('Search by ingredients: ', req.query.recipe)
            messages.FindSomeByIngredients(req, function(err, data) {
                res.setHeader('content-type', 'application/json')
                res.setHeader('accepts', 'GET')
                if (err) {
                    res.status(400)
                    res.end('error: ' + err)
                }
                res.status(201)
                res.send(data)
            })
        }
    } else {
        messages.FindSome(function(err, data) {
            res.setHeader('content-type', 'application/json')
            res.setHeader('accepts', 'GET')
            if (err) {
                res.status(400)
                res.end('error: ' + err)
            }
            res.status(200)
            res.send(JSON.stringify(data, null, 2))
        })
    }
})

server.post('/api/v1/messages', (req, res) => {
    messages.AddToCollection(req, function(err, data) {
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET', 'POST')
        if (err) {
            res.status(400)
            res.end('error: ' + err)
        }
        if (data.result.ok === 1) res.status(201)
        else console.log('Something went wrong adding: ' + JSON.stringify(req.body, null, 2))
        res.send('Successfully added')
    })
})

server.get('/api/v1/messages/delete', (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('accepts', 'GET')
    messages.UpdateByName(req, function (err, data) {
        if(err) {
            res.status(400)
            res.end("an error has occured:" + err)
            return;
        }
        res.status(200)
        res.send('Successfully deleted ' + data.result)
    })
})

server.get('/createCollection', (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('accepts', 'GET')
    db.CreateCollection(req, function(err, data) {
        if(err) {
            res.status(400)
            res.end("an error has occured:" + err)
            return;
        }
        res.status(200)
        res.send('Successfully created ' + data.result)
    })
})

server.get('/dropCollection', (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('accepts', 'GET')
    db.DropCollection(req, function(err, data) {
        if(err) {
            res.status(400)
            res.end("an error has occured:" + err)
            return
        }
        res.status(200)
        res.send('Successfully deleted ' + data.result)
    })
})

server.get('/api/v1/admin/getAll', (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('accepts', 'GET')
    admin.FindAll(function(err, data) {
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET')
        if (err) {
            res.status(400)
            res.end('error: ' + err)
        }
        res.status(200)
        res.send(JSON.stringify(data, null, 2))
    })
})

server.get('/api/v1/admin/forceDelete', (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('accepts', 'GET')
    admin.ForceDelete(req, function(err, data) {
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET')
        if (err) {
            res.status(400)
            res.end('error: ' + err)
        }
        res.status(200)
        res.send(JSON.stringify(data, null, 2))
    })
})

// start server and listen on ${port}
server.listen(port, err => {
    if (err) console.error(err)
    else console.log(`server is ready on port ${port}`)
})