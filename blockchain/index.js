const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor(){
        this.chain=[Block.genesis()];
    }

    addBlock({ data }){
        const block = Block.mine({
            lastBlock: this.chain[this.chain.length -1],
            data});

        this.chain.push(block);

        return block;
    }

    static isValid(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        for (let i=1; i<chain.length; i++){
            const lastBlockDifficulty = chain[i-1].difficulty;
            const lastBlockHash = chain[i-1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];

            if( Math.abs(lastBlockDifficulty - difficulty) > 1) return false;
            if(lastHash !== lastBlockHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if(hash !== validatedHash) return false;
        }

        return true;
    }

    replace(chain){
        if(chain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }
        if(!Blockchain.isValid(chain)){
            console.error('The incoming chain must be valid');
            return;
        }

        console.log('replacing chain with', chain);
        this.chain= chain;
    }
}

module.exports = Blockchain;