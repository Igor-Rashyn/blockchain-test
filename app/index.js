const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
// const P2pServer = require('./p2p-server');
const PubSub = require('./pubsub');


const HTTP_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${HTTP_PORT}`;
let PEER_PORT;
if(process.env.GENERATE_PEER_PORT === 'true'){
    
    PEER_PORT = HTTP_PORT + Math.ceil(Math.random() * 1000);
}

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain});
// const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const {data} = req.body;
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    // p2pServer.syncChains();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if(transaction){
            transaction.update({ senderWallet: wallet, recipient, amount })
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);
    console.log('transactionPool', transactionPool);

    res.json({ type: 'success', transaction });
});

const syncChains = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync with', rootChain);
            blockchain.replace(rootChain);
        }
    });
};

const PORT = PEER_PORT || HTTP_PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    if(PORT !== HTTP_PORT){
      syncChains();
    }
});

// p2pServer.listen();

