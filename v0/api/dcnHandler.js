const Message = require('../lib/message')
const models = {
    account: require('../models/account'),
    document: require('../models/document'),
    grant: require('../models/grant')
}

const _DEBUG = true

module.exports = async (req, res) => { 
    if(_DEBUG) 
        console.log('\n')

    let message = new Message(req.body)

    if( ! message.parse() ){
        res.json({error:-1})
        return 
    }

    if(_DEBUG){
        console.log('*************************************************************************')
        console.log(message.model.toUpperCase() +' / '+message.method.toUpperCase() )
        console.log(message.payload)
        console.log(message.sender.address)
    }

    let out = await models[message.model][message.method].fn(message.params, req.body.data)

    if(_DEBUG){
        console.log('*************************************************************************')
        console.log(out)
        console.log('-------------------------------------------------------------------------')
    }

    res.json({result:out})
}