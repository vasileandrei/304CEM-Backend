'use strict'

const messages = require('../modules/messages')

const databaseData = {
    host: 'sql2.freemysqlhosting.net',
    user: 'sql2261741',
    password: 'zR9%aE1*',
    database: 'sql2261741',
    port: 3306
}

const testBody = {
    body : {
        id: 9999,
        name: 'John Doe',
        email: 'JohnDoe@coventry.co.uk',
        url: 'http://JohnDoe.co.uk',
        message: 'Hello, I\'m John Doe'
    },
}

describe('add', () => {

    afterEach( () => messages.deleteById(databaseData, {params: {id: 9999}}, function (err, data) {
        if (err) console.error('Error cleaning up: ' + err)
    }))

    test('add one item to db', () => {
        expect.assertions(1)
        let dataReceived = ''
        messages.add(databaseData, testBody, function (err, data) {
            if (err) console.error(err)
            messages.getById(databaseData, testBody, function (err, data) {
                if (err) console.error(err)
            })
        })
        dataReceived = messages.getById(databaseData, {params: {id: 9999}}, function (err, data) {
            if (err) console.error('Error retrieving data: ' + err)
            dataReceived = JSON.parse(data)
            expect(testBody['body']).toEqual(dataReceived[0])
        })
    })

})