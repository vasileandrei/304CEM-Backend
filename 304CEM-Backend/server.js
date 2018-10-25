#!/usr/bin/env node

'use strict'

// import dependencies (npm install <name>)
const express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'})    // render main.handlebar
const bodyParser = require('body-parser');
const db = require('./modules/database')
const messages = require('./modules/messages')

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

const databaseData = {
    host: 'sql2.freemysqlhosting.net',
    user: 'sql2261741',
    password: 'zR9%aE1*',
    database: 'sql2261741',
    port: 3306
}

// foundation route
server.get('/', (req, res) => {
    let lang = ''
    if(req.query !== undefined && req.query.lang !== undefined) {
        if (req.query.lang === 'en') lang = 'Welcome'
        else if (req.query.lang === 'fr') lang = 'Bonjour'
        else if (req.query.lang === 'sp') lang = 'Bienvenido'
    }
    res.render('myCv', {language: lang})
})

server.post('/api/v1/messages', (req, res) => {
    if (req.body) console.log(req.body['formName'])
    messages.add(databaseData, req, function (err, data) {
        //tell the client we sending json data
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET, POST') 
        if (err) {
            res.status(400)
            res.end('error: ' + err)
        }
        res.status(201)
        res.redirect('/api/v1/messages')
    })
})

server.get('/api/v1/messages', (req, res) => {
    // let q = ''
    // let d = ''
	// if(req.query !== undefined && req.query.q !== undefined) {
    //     q = req.query.q
    // }
    messages.getAll(databaseData, req, function (err, data) {
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET')
        if(err) {
            res.status(400);
            res.end("an error has occured:" + err);
            return;
        }
        res.status(200)
        res.send(data)
        // res.render('messages', {query: q, data: d})
    })
})

server.get('/api/v1/messages/:id', (req, res) => {
    messages.getById(databaseData, req, function (err, data) {
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET')
        if(err) {
            res.status(400);
            res.end("an error has occured:" + err);
            return;
        }
        res.status(200)
        res.end(data)
    })
})

// server.put('/api/v1/messages/:id', (req, res) => {
//     messages.updateById(databaseData, req, function (err, data) {
//         if(err) {
//             res.status(400);
//             res.end("an error has occured:" + err);
//             return;
//         }
//         res.status(200)
//         res.end(data)
//     })
// })

server.delete('/api/v1/messages/:id', (req, res) => {
    messages.deleteById(databaseData, req, function (err, data) {
        if(err) {
            res.status(400);
            res.end("an error has occured:" + err);
            return;
        }
        res.status(200)
        res.end(data)
    })
})

server.get('/createTables', (req, res) => {
    db.createTables(databaseData, function(err, state) {
    if(err) {
        res.status(400);
        res.end("an error has occured:" + err);
        return;
    }
    res.status(200);
    res.end("tables were created successfully");
    })
})

server.get('/dropTables', (req, res) => {
    db.dropTables(databaseData, function(err, state) {
    if(err) {
        res.status(400);
        res.end("an error has occured:" + err);
        return;
    }
    res.status(200);
    res.end("tables were deleted successfully");
    })
})

// start server and listen on ${port}
server.listen(port, err => {
    if (err) console.error(err)
    else console.log(`server is ready on port ${port}`)
})