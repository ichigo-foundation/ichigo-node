
const keccak256 = require('keccak256')

module.exports = {
    addressify: function(s){
        return keccak256(s).slice(-20).toString('hex')
    },

    generateDocID: function(addr){
        addr = addr.slice(2)
        let salt = this.addressify(Date.now() + Math.random().toString())
        return addr.split('').map( (z,i) => z + salt.split('')[i] ).join('')
    },

    decodeDocID: function(z){
        var a='', b=''
        z.split('').forEach( (e,i) => { 
            if (i%2==0)  a += e
            else  b += e
        })
        return {address: a, salt: b}
    }
}