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




const redisPubChannel = 'wai.relay.ipfs.to.redis';
const redisSubChannel = 'wai.relay.redis.to.ipfs';

const ipfsSubTopic = 'wai-ipfs-task-switch-created';
const ipfsPubTopic = 'wai-ipfs-task-switch-finnished';



subRedis.on("message", function(channel, msg) {
  //console.log('subRedis.on channel=<',channel,'>');
  //console.log('subRedis.on msg=<',msg,'>');
  let jsonMsg = JSON.parse(msg);
  if(jsonMsg) {
    //console.log('subRedis.on jsonMsg=<',jsonMsg,'>');
    if(jsonMsg.word) {
      collectWords(jsonMsg.word);
    } else {
      //console.log('subRedis.on jsonMsg=<',jsonMsg,'>');
      finnishOneResourceBlock(jsonMsg);
    }
  }
  /*
  const msgBuff = Buffer.from(msg);
  ipfs.pubsub.publish(ipfsPubTopic,msgBuff);
  */
});


subRedis.on("ready", (err) => {
  console.log('subRedis err=<',err,'>');
});
subRedis.subscribe(redisSubChannel);


const onRcvIpfsMsg = (msg) => {
  console.log('onRcvIpfsMsg msg=<',msg,'>');
  //console.trace();
  pubRedis.publish(redisPubChannel,msg.data.toString('utf8'));
}
ipfs.pubsub.subscribe(ipfsSubTopic, onRcvIpfsMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopic=<',ipfsSubTopic,'>');
});

ipfs.pubsub.peers(ipfsSubTopic, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${ipfsSubTopic}`, err)
  }
  console.log(peerIds)
})



let oneBlockWords = {};
function collectWords(words) {
  //console.log('collectWords words=<',words,'>');
  for(let i = 0;i < words.length ; i++) {
    let wordRank = words[i];
    //console.log('collectWords wordRank=<',wordRank,'>');
    let keys = Object.keys(wordRank);
    //console.log('collectWords keys=<',keys,'>');
    let word = keys[0];
    if(oneBlockWords[word]) {
      oneBlockWords[word] += wordRank[word];
      //console.log('collectWords oneBlockWors[word]=<',oneBlockWors[word],'>');
    } else {
      oneBlockWords[word] = wordRank[word];
    }
  }
}
function finnishOneResourceBlock(blocks) {
  console.log('finnishOneResourceBlock blocks=<',blocks,'>');
  //console.log('finnishOneResourceBlock oneBlockWords=<',oneBlockWords,'>');
  let oneBlockWordsStr = JSON.stringify(oneBlockWords);
  //console.log('finnishOneResourceBlock oneBlockWordsStr=<',oneBlockWordsStr,'>');
  const msgBuff = Buffer.from(oneBlockWordsStr);
  ipfs.add(msgBuff, function (err, files) {
    console.log('finnishOneResourceBlock files=<',files,'>');
  });
  
}
