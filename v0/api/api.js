const dcnHandler = require('./dcnHandler')
const gatewayHandler = require('./gatewayHandler')

const endpoints = [
    {
        // send the detail of this server
        method: 'get',
        URL: '/dcn',
        fn: function(req, res){ res.json({ error: 751 }) }
    },
    {
        method: 'post',
        URL: '/dcn',
        fn: dcnHandler
    },
    {
        method: 'get',
        URL: '/ipfs/:cid',
        fn: gatewayHandler
    }
]

module.exports = {
    init: (app) => {
        endpoints.forEach ( ep => {
            app.route( ep.URL )[ep.method]( ep.fn )
        })
        app.get('/', function(req, res){ res.json({ error: 0 }) })
    }
}