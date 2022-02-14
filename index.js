const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const port = 3001 || process.env.PORT
//
const entry = require('./core/entry')
const bodyParser = require('body-parser')
//
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(fileUpload())
//
const start = async () => {
    await entry(app)
    app.listen(port)
    console.log('Ready on port '+port)
}

start()

