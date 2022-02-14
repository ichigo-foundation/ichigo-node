const ERROR = require('./error')

const FlashStorage = require('./flashstorage')
const ProfileLedger = require('./profile')
const KagiLedger = require('./kagi')


const TIMEOUT = 3 *(60*1000)

class Instruction {


    static publicInstructions = [
        'getProfile',
        'getKagi',
        'getFsEstimate',
    ]

    /**
    * @params
    * @params
    *
    * @callback
    */
    static getProfile({owner}, callback){
        if(!owner){
            callback({error:ERROR.invalid_params})
            return
        }

        ProfileLedger.get(owner)
        .then(r => {
            if(r)
                callback({error: ERROR.ok, payload: r })
            else
                callback({error: ERROR.profile_not_found})
        })
    }

    static getKagi({filter}, callback){
        if(!filter){
            callback({error:ERROR.invalid_params})
            return
        }

        var ret = []
        KagiLedger.get(filter)
        .then( c => {
            c.forEach( k => {
                delete k._id
                ret.push(k)
            }).then( _ => callback({error: ERROR.ok, payload: ret }))
        })
        .catch( _ => callback({error: ERROR.kagi_failure}) )
    }

    static getFsEstimate({size, time}, callback){
        FlashStorage.estimate(size, time, callback)
    }

    static setProfile({basic, timestamp}, identity, callback){

        if(!basic || !timestamp || !Instruction.isTimely(timestamp)){
            callback({error:ERROR.invalid_params})
            return
        }

        ProfileLedger.create(identity, basic, timestamp)
        .then( r => callback({error:ERROR.ok}))
        .catch( e => { callback({error: ERROR.profile_already_set})})
    }

    static setKagi({audience, docID, key}, identity, callback){

        if(!audience || (audience!='@' && !docID) || (audience!='$' && !key) ){
            callback({error:ERROR.invalid_params})
            return
        }

        KagiLedger.set(identity, docID, audience, key)
        .then( res => callback({error:ERROR.ok}))
        .catch( res => callback({error:ERROR.kagi_failure}))
    }

    static setManyKagi({docID, readerKeys}, identity, callback){

        if(!docID || !readerKeys ){
            callback({error:ERROR.invalid_params})
            return
        }

        var proms = []
        for( let reader in readerKeys){
            proms.push( new Promise((resolve, reject) =>
                KagiLedger.set(identity, docID, reader, readerKeys[reader]).then( _ => resolve(_)) )
            )
        }

        Promise.all(proms)
        .then( _ => callback({error:Error.ok}))
        .catch( e => callback({error:Error.kagi_failure}))
    }

    /**
    * pin file to ipfs & commit contract
    *
    * @params {bin} file to pin
    * @params {wire} ichigo transfer intruction signed by requester
    *
    * @callback payload{cost}
    */
    static store({size, time, cost, bin, wire}, identity, callback){
        if(!size || !time || !cost || !bin || !wire){
            callback({error:ERROR.invalid_params})
            return
        }

        let fs = new FlashStorage()

        fs.pack(identity, bin, wire)
        .then( ok => fs.commit() )
        .then( res =>  fs.pack(identity, size, time) )
        .then( hash => callback({error:ERROR.ok, payload:{IpfsHash: hash}}) )
        .catch( err => callback(err) )

    }


    static adminInstructions = [
        'listPin',
        'unpin',
        'unpinAll',
        'getContract',
        'collect',

    ]

    static listPin(params, identity, callback){
        FlashStorage.listPin(callback).then((result) => {
            callback({error:ERROR.ok, payload:result})
        })
    }

    static unpin({hash}, identity, callback){
        FlashStorage.collect(hash)
        .then( result => {
            callback({error:ERROR.ok, payload:result})
        })
        .catch( err => {
            callback({error:ERROR.storage_not_found})
        })
    }

    static unpinAll(params, identity, callback){

        FlashStorage.listPin(callback).then( async (result) => {
            var hashs = result.rows.filter( a => a.date_unpinned == null).map( a => a.ipfs_pin_hash )
            for(var i in hashs) {
                console.log(hashs[i])
                await FlashStorage.collect(hashs[i])
            }
            callback({error:ERROR.ok, payload:hashs})
        })
    }

    static getContract({filter}, identity, callback){
        if(!filter){
            callback({error:ERROR.invalid_params})
            return
        }

        var ret = []
        KagiLedger.getContracts(filter)
        .then( c => {
            c.forEach( k => {
                ret.push(k)
            }).then( _ => callback({error: ERROR.ok, payload: ret }))
        })
        .catch( _ => callback({error: ERROR.kagi_failure}) )
    }

    static collect({docID}, identity, callback){
        Promise.all([
            FlashStorage.collect(docID), // TODO handle wrong docID
            KagiLedger.remove({docID:docID}),
            KagiLedger.removeContract({_id:docID})
        ])
        .then(_ => callback({error: ERROR.ok, payload: _ }))
        .catch(_ => callback({error: ERROR.kagi_failure, payload: _}))
    }


    /********************************************************************* Internal Mthods */

    static isValid(method) {
        return Object.getOwnPropertyNames(Instruction)
            .filter(p => typeof Instruction[p] === 'function' && p !== 'isValid')
            .includes(method)
    }

    static isPublic(method){
        return this.publicInstructions.includes(method)
    }

    static isAdmin(method){
        return this.adminInstructions.includes(method)
    }

    static isTimely(ts){
        return TIMEOUT < ( Date.now() - new Date(parseInt(ts)) )
    }


}

module.exports = Instruction
