const IPFS = require('ipfs-core')
const pinataSDK = require('@pinata/sdk')
const conf = require('../conf')

var main = {
    init: async function() {
        for(var key in conf.ipfsProvider){
            let nodeType = conf.ipfsProvider[key].nodeType
            if(this['_'+nodeType] == undefined){
                console.log('conf error: unknown ipfs provider ['+nodeType+']')
                return false
            }
            try{
                this[key] = this['_'+nodeType]
                await this[key].init(key)
            }catch(_){
                console.log('conf error: could not initialize ipfs provider '+nodeType)
                console.log(_)
                return false
            }
        }
        return true
    },

    _pinata: {
        init: function(key) {
            this.options = conf.ipfsProvider[key].options
            this.instance = pinataSDK(conf.ipfsProvider[key].apiKey, conf.ipfsProvider[key].apiSecret, this.options?.create)
        },
        add: async function(content) {
            content = {_0:content}
            let {IpfsHash} = await this.instance.pinJSONToIPFS(content, this.options?.add)
            return IpfsHash
        }
    },

    _local: {
        init: async function(key) {
            this.options = conf.ipfsProvider[key].options
            this.instance = await IPFS.create(this.options?.create)
        },
        add: async function(content) {
           let {path} = await this.instance.add(content, this.options?.add)
           return path
        },
        get: async function(cid) {
            var content = []
            for await (const file of this.instance.get(cid)) {
                if (!file.content) continue;

                for await (const chunk of file.content) {
                    content.push(chunk)
                }
            }
            return content
        }
    }

}

module.exports = main