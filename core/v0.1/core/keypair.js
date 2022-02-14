
const hdkey = require('hdkey')
const keccak256 = require('keccak256')

class Keypair {

    constructor(pubkey) {
        this._instance = new hdkey()
        if(pubkey){
            this._instance.publicKey = Buffer.from(pubkey, 'base64')
        }
    }

    setPublicKey(pubkey){
        this._instance.publicKey = Buffer.from(pubkey, 'base64')
    }

    verify(msg, signature){
        return this._instance.verify(keccak256(msg), Buffer.from(signature,'base64'))
    }

    static admin_keys = [
        'list of admin public key goes here'
    ]

    isAdmin(pubKey){
        return Keypair.admin_keys.includes(this._instance._publicKey.toString('base64'))
    }
}

module.exports = Keypair