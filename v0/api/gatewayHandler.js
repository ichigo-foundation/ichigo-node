var ipfsConnector = require('../datastore/ipfsConnector')
var conf = require('../conf.js')
const CID = require('cids')

module.exports = async (req, res) => { 
    let content = await ipfsConnector.local.get(req.params.cid)
    res.send(content.toString())
}