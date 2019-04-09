const cryptoHash = require('./crypto-hash');
const { GENESIS_DATA } = require('./config');


class Block {
    constructor({timestamp, lastHash, hash, data}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }


    toString(){
        return `Block -
        Timestamp: ${this.timestamp}
        Last hash: ${this.lastHash.substring(0,10)}
        Hash     : ${this.hash.substring(0,10)}
        Data     : ${this.data}
        `;
    }

    static genesis(){
        return new this(GENESIS_DATA);
    }

    static mine({ lastBlock, data }){
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        
        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        })
    }
}

module.exports = Block;