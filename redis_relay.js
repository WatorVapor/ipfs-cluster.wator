const ipfsAPI = require('ipfs-api');
//var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
const ipfs = ipfsAPI('localhost', '5002', {protocol: 'http'})
console.log('ipfs=<',ipfs,'>');

ipfs.id(function (err, identity) {
  if (err) {
    throw err;
    process.exit();
  }
  console.log('identity=<',identity,'>');
});

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

setTimeout(function(){
  const msg = new Buffer('banana');
  ipfs.pubsub.publish(topic, msg, (err) => {
    if (err) {
      throw err;
    }
    console.log('sented msg=<',msg,'>');
  });
},1000);

