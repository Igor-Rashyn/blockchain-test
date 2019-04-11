const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        senderWallet = new Wallet()
        transaction = new Transaction({
            senderWallet: senderWallet,
            recipient: 'new-recipient',
            amount: 50
        });

        transactionPool = new TransactionPool()
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(transaction);
        });
    });

});