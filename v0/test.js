// node console

// const springAddr = '/orbitdb/zdpuAttBhChm4VAHcYFpqsTBhUPr8j2uGEeY64JxcYYg87HjM/account'
// const OrbitDB = require('orbit-db')
// const IPFS = require('ipfs-core')
// var ipfs, db, spring
// IPFS.create().then(a=>{ipfs=a; OrbitDB.createInstance(ipfs, {}).then(b=>{db=b; db.open(springAddr).then( c => { spring = c; spring.load() })})})


// b = spring.all.map(a => a.payload.value._id)

// {
//   _id: '0x36c3c469c296de749ca4fab84b9c97822c09ceae',
//   publicKey: '02e163eddd20627e58d06995fe00dcec88402fe4d95338f2651bace18d4b890815',
//   profile: { displayName: 'PASCAL' },
//   friendships: [],
//   manifest: {
//     grants: 'zdpuAywPXJbugPhvuqSV5TCZes2dRibQ4HvNt15YRHmAk6KZC',
//     docs: 'zdpuAzkkaBY1tm5y5NfUDia86ZGpU22F5pKFFcA7SomxD8T1F'
//   }
// }
 

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

const pinataOptions = {
    customPinPolicy: {
        regions: [
            {
                id: 'FRA1',
                desiredReplicationCount: 1
            },
            {
                id: 'NYC1',
                desiredReplicationCount: 2
            }
        ]
    }
}

const main = async () => {
 
    const body = {
        _0: 'Pinatas are awesome'
    }
    const options = {
        pinataMetadata: {
            name: 'MyCustomName',
            keyvalues: {
                customKey: 'customValue',
                customKey2: 'customValue2'
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    }
    pinata.pinJSONToIPFS(body).then((result) => {
        //handle results here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    })
}

main()