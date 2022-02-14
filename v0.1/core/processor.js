const Instruction = require('./instruction')
const ERROR = require('./error')
const {certif} = require('./utils')
const {Keypair} = require('./classes')

module.exports.process = async (request, callback) => {

    try{
        var _instruction = request.body.instruction,
            _payload = request.body.payload,
            _certif = request.body.certif,
            _timestamp = request.body.timestamp,
            _bin = request.files?.bin

        var params = _payload ? JSON.parse(_payload) : {}
            params.bin = _bin
            params.wire = request.body.wire
            params.timestamp = _timestamp

    }catch(_){
        callback({error: ERROR.invalid_request})
        return
    }

    // check message integrity
    if(!(_instruction && Instruction.isValid(_instruction))){
        callback({error: ERROR.invalid_request})
        return
    }

    // public instruction do not require to be signed
    if(Instruction.isPublic(_instruction)){
        Instruction[_instruction](params, callback)
        return
    }

    // verify signature and call instruction
    try{

        let msg = _payload ? _instruction.concat(_payload) : _instruction
        let {signature, address, publicKey} = certif.extract(_certif)

        try{
            var kp = new Keypair(publicKey)
        }catch{ throw ERROR.invalid_signature }

        if( kp.verify(msg, signature) ){
            // check for admin instruction
            if(Instruction.isAdmin(_instruction) && !kp.isAdmin()){
                throw ERROR.unauthorized_signature
            }

            Instruction[_instruction](params, address, callback)

        } else throw ERROR.invalid_signature
    }catch(_){
        callback({error: ERROR.invalid_signature, comment: _})
        return
    }


}

