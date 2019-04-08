const Block = require('./block');


const fooBlock = Block.mine(Block.genesis(), 'foo');
console.log(fooBlock.toString());