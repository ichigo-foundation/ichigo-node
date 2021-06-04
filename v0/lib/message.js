
const HDKey = require('hdkey')
const keccak256 = require('keccak256')
const models = {
    account: require('../models/account'),
    document: require('../models/document'),
    grant: require('../models/grant')
}

const __DBG = true

class Message {
    
    constructor(raw) {
        this.raw = raw
    }

    parse(){
        return this.checkIntegrity() &&
            this.parseMeta() &&
            this.checkIdentity() &&
            this.parsePayload()
    }

    checkIntegrity(){
        if(!['meta','payload','identity'].every(k => k in this.raw))
        console.log(' Integrity error: structure must be {meta, payload, identity}')
        return ['meta','payload','identity'].every(k => k in this.raw)
    }

    parseMeta(){

        var tmp = this.raw.meta.split('/')
        if(tmp.length !== 4){
            console.log('meta wrongly formatted') 
            return false // meta wrongly formatted
        }

        this.version = tmp[0]

        switch(this.version){
            case 'P01':
                // P01 is the only version at the moment
                // come back later and add new version here
                this.format = tmp[1]
                // this value has no impact atm, only format supported is ECDSA:KEC:B64:A-CBR
                // come back later and other algo/encoding so client can choose its preference
                break

            default:
               console.log('version unknow')
               return false // unknown message version
        }

        this.model = tmp[2]
        this.method = tmp[3]

        return true
    }

    parsePayload(){
        this.params = {}

        try{
            this.payload = JSON.parse(this.raw.payload)
        }catch(_){
            console.log('payload not parseable')
            return false
        }

        if(models[this.model] == undefined || models[this.model][this.method] == undefined || models[this.model][this.method].params == undefined){
            console.log('model / methods could not be found : '+ this.model +' > '+this.method)
            return false
        }

        for(let def of models[this.model][this.method].params){
            let param = def.split('.')
            if( this[param[0]][param[1]] == undefined ){
                console.log('paramters missing in payload : '+ def)
                return false
            }
            this.params[param[1]] = this[param[0]][param[1]]
        }

        return true
    }

    checkIdentity(){

        // TODO : if data check it matches the datahash 

        this.identity = JSON.parse( this.raw.identity )

        if( ! ['publicKey','signature'].every( k => k in this.identity )){
            console.log('signature wrongly formatted')
            return false // signature wrongly formatted
        }
        
        try {
            let tmp = Buffer.from(this.identity.publicKey, 'base64').toString('hex')
            this.sender = {
                publicKey: tmp,
                address: '0x'+Buffer.from(keccak256(tmp).slice(-20)).toString('hex')
            }
        } catch(e) { console.log('cannot parse signature'); return false } // signature wrongly formatted

        // Verify signature
        let hdkey = new HDKey()
        hdkey.publicKey = Buffer.from(this.sender.publicKey, 'hex')
        let hash = keccak256(this.identity.publicKey+this.raw.payload)
        if( !hdkey.verify(hash, Buffer.from(this.identity.signature, 'base64')) ){
            console.log('signature cannot be verified')
            return false
        }

        return true
    }
}

module.exports = Message
