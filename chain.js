const Block = require('./block');

class Chain {
    constructor(){
        this.chain=[Block.genesis()];
    }

    addBlock(data){
        const block = Block.mine(this.chain[this.chain.length -1], data);
        this.chain.push(block);

        return block;
    }

    isValid(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        for (let i=1; i<chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];

            if(block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)){
                return false;
            }

            return true;
        }
    }

    replace(newChain){
        if(newChain.length <= this.chain.length){
            console.log('Received chain is not longer than the current chain');
            return;
        } else if(!this.isValid(newChain)){
            console.log('The received chain is not valid.');
            return;
        }
        console.log('Replacing blockchain with the new chain');
        this.chain= newChain;
    }
}

module.exports = Chain;