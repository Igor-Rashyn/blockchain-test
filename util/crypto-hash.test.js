const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    const sha256 = 'e47fa9ad6e4766adb93578872159e81effae565d10b8c6ca8208a92622607fe9';

    it('generates a SHA-256 hashed output',() =>{
        expect(cryptoHash('bla-bla')).toEqual(sha256);
    })

    it('produces the same hash with the same input arguments in any order',() =>{
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
    })
});