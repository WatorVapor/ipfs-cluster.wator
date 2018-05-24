const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
//const ipfs = ipfsAPI('localhost', '5002', {protocol: 'http'})
//const ipfs = ipfsAPI('ipfs.wator.xyz', '443', {protocol: 'https'})
//console.log('ipfs=<',ipfs,'>');

ipfs.id( (err, identity) => {
  if (err) {
    throw err;
    process.exit();
  }
  console.log('identity=<',identity,'>');
});


const redis = require("redis");
let pubRedis = redis.createClient();
let subRedis = redis.createClient();

pubRedis.on("ready", (err) => {
  console.log('pubRedis err=<',err,'>');
});
subRedis.on("ready", (err) => {
  console.log('subRedis err=<',err,'>');
});



const watchTopic = 'wai-ipfs-task-switch-created';
const broadcastTopic = 'wai-ipfs-task-switch-finnished';



const receiveMsg = (msg) => {
  console.log('receiveMsg msg=<',msg,'>');
  //console.trace();
  pubRedis.publish(msg);
}
ipfs.pubsub.subscribe(watchTopic, receiveMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe watchTopic=<',watchTopic,'>');
});


