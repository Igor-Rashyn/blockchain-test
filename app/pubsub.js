const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub{
    constructor({blockchain}){
        this.blockchain = blockchain;

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

        if(channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replace(parsedMessage);
        }
    }

    subscribeToChannels(){
        Object.values(CHANNELS).forEach((chanel) =>{
            this.subscriber.subscribe(chanel);
        });
    }

    publish({chanel, message}){
        this.publicsher.publish(chanel, message);
    }

    broadcastChain(){
        this.publish({
            chanel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }
}

module.exports = PubSub;