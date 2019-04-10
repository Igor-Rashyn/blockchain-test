const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    const sha256 = '7ba5e8ef7029742e81085289b8c4ffd0801355df315b573f75b533a3d31cca74';

    it('generates a SHA-256 hashed output',() =>{
        expect(cryptoHash('bla-bla')).toEqual(sha256);
    })

    it('produces the same hash with the same input arguments in any order',() =>{
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
    })

    it('produces a unique hash when the properties have changed on an input', () => {
        const boom = {};
        const originalHash = cryptoHash(boom);
        boom['field'] = 'abc';

        expect(cryptoHash(boom)).not.toEqual(originalHash);
    });
});