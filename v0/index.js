/* main.js */
const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const port = process.env.PORT || 3000
//
const main = require('./main')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(fileUpload())

const startApp = async () => {
    console.log('initializing...')
    await main(app)
    app.listen(port)
    console.log('[OK] server started on: ' + port)
}

startApp()
