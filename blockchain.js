const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain=[Block.genesis()];
    }

    add(data){
        const block = Block.mine(this.chain[this.chain.length -1], data);
        this.chain.push(block);

        return block;
    }
}

module.exports = Blockchain;