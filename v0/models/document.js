const keccak256 = require('keccak256')
const ipfsConnector = require('../datastore/ipfsConnector')
const orbitConnector = require('../datastore/orbitConnector')
const utils = require('../lib/utils')
const conf = require('../conf')

const document = {

    getAll: {
        params: ['payload.address', 'payload.manifest'],
        fn: async function( params ) {
            let options = {
                create: false,
                localOnly: false,
                // maxHistory:-1,
                overwrite: false,
                replicate: true
            }

            var dbAddr = '/orbitdb/' + params.manifest + '/' + params.address + '@docs'

            var tmp = await orbitConnector.instance.open(dbAddr, options)
            await tmp.load()
            var result = tmp.all
            
            // Onlly extract the payloads  (because .all returns all orbitdb object)
            result = result.map( d => d.payload.value)

            tmp.close()

            return result
        }
    },

    get: {
        params: ['payload.address', 'payload.manifest', 'payload.documentID'],
        fn: async function(params) {
            let options = {
                create: false,
                localOnly: false,
                // maxHistory:-1,
                overwrite: false,
                replicate: true
            }

            var dbAddr = '/orbitdb/' + params.manifest + '/' + params.address + '@docs'

            var tmp = await orbitConnector.instance.open(dbAddr, options)
            await tmp.load()

            var result = tmp.get(params.documentID)

            tmp.close()

            return result
        }
    },

    post: {
        params: ['sender.address', 'payload.headers', 'payload.manifest', 'payload.key'],
        fn: async function(params) {

            let options = {
                create: false,
                localOnly: false,
                // maxHistory:-1,
                overwrite: false,
                replicate: true
            }
            var dbAddr = '/orbitdb/' + params.manifest + '/' + params.address + '@docs'
            var tmp = await orbitConnector.instance.open(dbAddr, options)
            await tmp.load()
            tmp.close()

            var docID = utils.generateDocID(params.address)
            //
            var load = {
                _id: docID,
                headers: params.headers,
                key: params.key,
                files: []
            }

            let cid = await tmp.put(load)

            return load
        }
    },

    addFile: {
        params: ['payload.manifest', 'payload.documentID', 'sender.address'],
        fn: async function(params, data) {

            let options = {
                create: false,
                localOnly: false,
                // maxHistory:-1,
                overwrite: false,
                replicate: true
            }

            var dbAddr = '/orbitdb/' + params.manifest + '/' + params.address + '@docs'
            var tmp =  await orbitConnector.instance.open(dbAddr, options)
            await tmp.load()

            var doc = tmp.get(params.documentID)[0]
            if(doc == undefined)
                return '0x0'

            var file  = await ipfsConnector[conf.provider].add(data)
            doc.files.push(file)

            tmp.put(doc)

            tmp.close()

            return file
        }
    }

}

module.exports = document