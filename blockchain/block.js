const hexToBinary = require('hex-to-binary');
const cryptoHash = require('../util/crypto-hash');
const { GENESIS_DATA, MINE_RATE } = require('../config');



class Block {
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
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
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({block: lastBlock, timestamp})
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
    }

    static adjustDifficulty({ block, timestamp }){
        const { difficulty } = block;

        if(difficulty < 1) return 1;

        return  timestamp - block.timestamp > MINE_RATE
                    ? difficulty - 1
                    : difficulty + 1;
    }
}

module.exports = Block;