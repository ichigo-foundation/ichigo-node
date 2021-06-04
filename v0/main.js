const api = require('./api/api.js')
const ipfsConnector = require('./datastore/ipfsConnector')
const orbitConnector = require('./datastore/orbitConnector')

module.exports = async (app) => {
    let tmp = await ipfsConnector.init()
    if(!tmp) {
        console.log('app could not be start')
        return
    }

    await orbitConnector.init(ipfsConnector.local.instance)
    
    // delete all accounts
    // console.log(orbitConnector.spring.all.length)
    // for(var a of orbitConnector.spring.all){
    //     console.log(a.payload.value._id)
    //     orbitConnector.spring.del(a.payload.value._id)
    // }

    api.init( app )
}
