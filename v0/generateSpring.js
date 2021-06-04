const IPFS = require('ipfs-core')
const OrbitDB = require('orbit-db')

const generate = async() => {
const ipfs = await IPFS.create()
const instance = await OrbitDB.createInstance(ipfs)
const db = await instance.docs('spring')
console.log(db.id)
}

generate()


