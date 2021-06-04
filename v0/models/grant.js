const orbitConnector = require('../datastore/orbitConnector')
const utils = require('../lib/utils')

module.exports = {

    getAll: {
        params: ['payload.address', 'payload.manifest'],
        fn: async function( params ) {

            // TODO: Add a filter to return only the grant addressed to the sender unless manifest owner

            let options = {
                create: false,
                localOnly: false,
                // maxHistory:-1,
                overwrite: false,
                replicate: true
            }

            var dbAddr = '/orbitdb/' + params.manifest + '/' + params.address + '@grants'

            var tmp = await orbitConnector.instance.open(dbAddr, options)
            await tmp.load()
            var result = tmp.all
            
            // Onlly extract the payloads 
            result = result.map( d => d.payload.value)

            tmp.close()

            return result
        }    
    },

    post: {
        params: ['payload.manifest', 'payload.documentID', 'payload.grantee', 'sender.address', 'payload.gKey', 'payload.permission'],
        fn: async (params) => {

            let grantID = utils.addressify( params.grantee+'/'+params.documentID )

            let options = {
                create: false,
                localOnly: false,
                // maxHistory:-1,
                overwrite: false,
                replicate: true
            }

            // open the manifest
            var dbAddr = '/orbitdb/' + params.manifest + '/' + params.address + '@grants'
            var tmp = await orbitConnector.instance.open(dbAddr, options)
            await tmp.load()

            // var tmpEntry = tmp.get(grantID)

            // if(tmpEntry.length != 0){
            //     console.log('Grant already exist -> Updating it')
            //     console.log(tmpEntry)
            // }

            var grant = {
                _id: grantID,
                grantee: params.grantee,
                documentID: params.documentID,
                permission: params.permission,
                gKey: params.gKey
            }

            var result = await tmp.put(grant)
        
            tmp.close()

            return grant
        }
    }
}