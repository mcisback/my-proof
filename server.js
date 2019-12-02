const express = require('express');
// const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const fs = require('fs')

const config = require('./config')
const env = process.env.NODE_ENV || 'dev'

const _ = require("lodash")

const faker = require('faker');

console.log('Using ENV: ', env)

function myRender(file, ctx = {}) {
    console.log('CTX: ', ctx)

    _.templateSettings.interpolate = /\{\{-(.*?)-\}\}/g
    const template = _.template(fs.readFileSync(`./public/${file}`))

    return template(ctx)
}

// Enable Cors
app.use(cors())

// Read Post JSON Body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/mygetproof.js', (req, res) => {
    console.log('Getting mygetproof.js')

    res.send(myRender('mygetproof.js', {config: config[env]}))
})

app.get('/widget.js', (req, res) => {
    console.log('Getting widget.js')

    res.send(myRender('widget.js', {config: config[env]}))
})

app.get('/person', (req, res) => {
    faker.locale = 'it'

    const card = faker.helpers.contextualCard()

    res.json(card)
})

// Use publicDir for static files
app.use(express.static(__dirname + config[env].publicDir))

// Generate Client Configuration based on server configuration :)
app.get('/ng/client-config.js', (req, res, next) => {
    res.send(`
        angular.module('globalConfigModule', [])
        .constant('GlobalConfig', {
            appName: 'MyGetProof',
            appVersion: 2.0,
            check: 'oh yes',
            appUrl: '${config[env].appUrl}'
        })
    `)
})

const server = app.listen(config[env].port, () => {
    const host = server.address().address
    const port = server.address().port
    
    console.log('Forum app listening at http://%s:%d', host, port)
})
