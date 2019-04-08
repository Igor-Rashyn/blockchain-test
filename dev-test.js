const Block = require('./blockchain/block');


const fooBlock = Block.mine(Block.genesis(), 'foo');
console.log(fooBlock.toString());