const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub{
    constructor({ blockchain, transactionPool}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publicsher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replace(parsedMessage);
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }
    }

    subscribeToChannels(){
        Object.values(CHANNELS).forEach((chanel) =>{
            this.subscriber.subscribe(chanel);
        });
    }

    publish({chanel, message}){
        this.subscriber.unsubscribe(chanel, () => {
            this.publicsher.publish(chanel, message, () => {
                this.subscriber.subscribe(chanel);
            });
        })
    }

    broadcastChain(){
        this.publish({
            chanel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction){
        this.publish({
            chanel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}

module.exports = PubSub;