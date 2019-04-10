const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
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
})

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

