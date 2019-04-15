const Block = require('./block');

const fooBlock = Block.mineBlock(Block.genesis(),'bar');
console.log('print foo');
console.log(fooBlock.toString());
console.log('printed foo');

