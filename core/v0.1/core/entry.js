const processor = require('./processor')

module.exports = async (app) => {

    app.route( '/transaction' ).post( async (request, resolve) => {
        processor.process(request, function(result) {
            resolve.json(result)
        })
        return true
    })

}
