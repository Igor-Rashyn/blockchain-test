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

    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];

            for (let i=0; i<10; i++){
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'one-recipient',
                    amount: 30
                });

                if (i%3 === 0) {
                    transaction.input.amount = 999999999;
                } else if (i%3 === 1) {
                    transaction.input.signature = new Wallet().sign('baam!');
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns valid transaction', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });
    });


});