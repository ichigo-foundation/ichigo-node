// TODO store the account address somewhere else
module.exports = {
    provider:'local',
    ipfsProvider: {
        pinata: {
            nodeType: 'pinata',
            baseUrl: 'https://api.pinata.cloud',
            apiKey: 'bdbf37e6dfc8c76ddc38',
            apiSecret: 'a61e3ac05f00ff9df02e97ee03b1305d6daa06c0c092ff4da10a926bad9f58c3',
            options: {
                create: {},
                add: {
                    pinataOptions: {
                       cidVersion: 0
                    }
                }
            }
        },

        local: {
            nodeType: 'local',
            baseUrl:'127.0.0.1',
            options: {
                add:{
                    cidVersion: 0
                }
            }
        }
    }

}