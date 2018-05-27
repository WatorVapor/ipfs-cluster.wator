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
let subRedis = redis.createClient();




const redisSubChannel = 'wai.relay.redis.to.ipfs';
const broadcastIpfsTopic = 'wai-ipfs-task-switch-finnished';



subRedis.on("message", function(channel, msg) {
  console.log('subRedis.on channel=<',channel,'>');
  console.log('subRedis.on msg=<',msg,'>');
  const msgBuff = Buffer.from(msg);
  ipfs.pubsub.publish(broadcastIpfsTopic,msgBuff);
});


subRedis.on("ready", (err) => {
  console.log('subRedis err=<',err,'>');
});
subRedis.subscribe(redisSubChannel);


