const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');

const topic = 'fruit-of-the-day';
const msg = new Buffer('banana');
ipfs.pubsub.publish(topic, msg, (err) => {
  if (err) {
    throw err;
  }
  console.log('sented msg=<',msg,'>');
});

ipfs.pubsub.peers(topic, (err, peerIds) => {
  if (err) {
    throw err;
  }
  console.log('peers peerIds=<',peerIds,'>');
})

ipfs.pubsub.ls((err, topics) => {
  if (err) {
    throw err;
  }
  console.log('ls topics=<',topics,'>');
})
