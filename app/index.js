const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
// const P2pServer = require('./p2p-server');
const PubSub = require('./pubsub');

const HTTP_PORT = process.env.HTTP_PORT || 3000; //HTTP_PORT =3002 npm run dev

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});
// const p2pServer = new P2pServer(blockchain);

setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const {data} = req.body;
    blockchain.addBlock({ data });

    // p2pServer.syncChains();
    res.redirect('/api/blocks');
})

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`)
});

// p2pServer.listen();

