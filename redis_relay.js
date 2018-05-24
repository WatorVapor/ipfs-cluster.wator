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




const redisPubChannel = 'wai.relay.ipfs.to.redis';
const redisSubChannel = '"wai.relay.redis.to.ipfs';
const watchIpfsTopic = 'wai-ipfs-task-switch-created';
const broadcastIpfsTopic = 'wai-ipfs-task-switch-finnished';


const onRcvRedisMsg = (msg) => {
  console.log('onRcvRedisMsg msg=<',msg,'>');
  //console.trace();
  const msg = Buffer.from(msg);
  ipfs.pubsub.publish(broadcastIpfsTopic,msg);
}

subRedis.subscribe(redisSubChannel, onRcvRedisMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe redisSubChannel=<',redisSubChannel,'>');
});



const onRcvIpfsMsg = (msg) => {
  console.log('onRcvIpfsMsg msg=<',msg,'>');
  //console.trace();
  pubRedis.publish(redisPubChannel,msg.toString('utf8'));
}
ipfs.pubsub.subscribe(watchIpfsTopic, onRcvIpfsMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe watchIpfsTopic=<',watchIpfsTopic,'>');
});


