const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
    let transactionPool, transaction;

    beforeEach(() => {
        transaction = new Transaction({
            senderWallet: new Wallet(),
            recipient: 'new-recipient',
            amount: 50
        });

        transactionPool = new TransactionPool()
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction)
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

});