const OrbitDB = require('orbit-db')
const CONST = require('../lib/constant.js')

dbOptions = {
    create: false,
    localOnly: false,
    // maxHistory:-1,
    overwrite: false,
    replicate: true
}

var main = {
    // spring: {},
    init: async function(ipfs) {
        await this.initInstance(ipfs)
        await this.initSpring()
    },

    initInstance: async function(ipfs) {
        if(this.instance == undefined){
            this.instance = await OrbitDB.createInstance(ipfs, dbOptions)
        }
        return this.instance
    },

    initSpring: async function() {
        if(this.spring == undefined){
            this.spring = await this.instance.open(CONST.springAddress)
            await this.spring.load()
        }

        return this.spring
    },

    account: {
        get: (addr) => {
            return main.spring.get(addr)
        },

        set: (account) =>{
            return main.spring.put(account)
        }
    },

    document: {
        createDB: (addr) => {
            return main.instance.docs(addr +'@docs')
        }
    },

    grant: {
        createDB: (addr) => {
            return main.instance.docs(addr +'@grants')
        }
    },

    fieldToStringify: ['profile'],

    encode: function(obj){
        for(k in obj){
            if(this.fieldToStringify.includes(k)){
                obj.k = JSON.stringify(obj.k)
            }
        }
        return k
    },

    decode: function(obj){
        for(k in obj){
            if(this.fieldToStringify.includes(k)){
                obj.k = JSON.parse(obj.k)
            }
        }
        return k        
    }

}


module.exports = main