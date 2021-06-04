const ipfsConnector = require('../datastore/ipfsConnector')
const orbitConnector = require('../datastore/orbitConnector')

const account = {

    get: {
        params: ['payload.address'],
        fn: function(params) {
            let res = orbitConnector.account.get(params.address)
            return res
        }
    },

    set: {
        params: ['sender.address', 'sender.publicKey', 'payload.displayName', 'payload.profile'],
        fn: async function(params) {

            var tmp = account.get.fn({address: params.address})
            if(tmp.length > 0){
                return '0x0'
            }

            let manifest =  {
                grants: (await orbitConnector.grant.createDB(params.address)).address.root,
                docs: (await orbitConnector.document.createDB(params.address)).address.root
            }

            let newAccount = {
                    _id:params.address,
                    publicKey:params.publicKey,
                    displayName: params.displayName,
                    profile: params.profile,
                    friends: [],
                    manifest: manifest
                }

            let result = await orbitConnector.account.set(newAccount)

            return newAccount
        }
    },

    addFriend: {
        params: ['sender.address', 'payload.friend'],
        fn: async function(params) {

            var me = account.get.fn({address: params.address})
            var friend = account.get.fn({address: params.friend})

            if( me.length == 0 || friend.length == 0){
                console.log('account was not found')
                return
            }

            if(!me[0].friends.includes(params.friend)) {
                me[0].friends.push(params.friend)
                let result = await orbitConnector.spring.put( me[0] )
            }

            return friend[0]
        }
    }
}

module.exports = account