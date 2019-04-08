const Chain = require('./index');
const Block = require('./block');

describe('Chain', () =>{
    let bc, bc2;

    beforeEach(() => {
        bc = new Chain();
        bc2 = new Chain();
    });

    // it('start with genesis block', () => {
    //     expect(bc.chain[0]).toEqual(Block.genesis());
    // });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        bc2.addBlock('foo');
        expect(bc.isValid(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'bad data';
        expect(bc.isValid(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'not foo';
        expect(bc.isValid(bc2.chain)).toBe(false);
    });

    if('replaces the chain with a valid chain', () =>{
        bc2.addBlock('goo');
        bc.replace(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    if('does not replace the chain with one of less than or equal to length', () =>{
       bc.addBlock('foo');
       bc.replace(bc2.chain);
       expect(bc.chain).not.toEqual(bc2.chain) 
    });

});