const ipfsAPI = require('ipfs-api');
//var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
//const ipfs = ipfsAPI('localhost', '5002', {protocol: 'http'})
const ipfs = ipfsAPI('ipfs.wator.xyz', '443', {protocol: 'https'})
console.log('ipfs=<',ipfs,'>');

ipfs.id( (err, identity) => {
  if (err) {
    throw err;
    process.exit();
  }
  console.log('identity=<',identity,'>');
});


const redis = require("redis");
let pub = redis.createClient();
let sub = redis.createClient();

pub.on("ready", (err) => {
  console.log('pub err=<',err,'>');
});
sub.on("ready", (err) => {
  console.log('sub err=<',err,'>');
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


