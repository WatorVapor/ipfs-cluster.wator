const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');

const topic = 'fruit-of-the-day';
const receiveMsg = (msg) => {
  console.log('receiveMsg msg=<',msg,'>');
  console.trace();
}
ipfs.pubsub.subscribe(topic, receiveMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe topic=<',topic,'>');
});
