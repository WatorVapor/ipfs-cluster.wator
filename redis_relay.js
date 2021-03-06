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
  //console.log('identity=<',identity,'>');
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

const crystal = require('./crystal.wator.json');
console.log('crystal=<',crystal,'>');
const cTestPaymentAddress = crystal.payaddress;
console.log('cTestPaymentAddress=<',cTestPaymentAddress,'>');


function finnishOneResourceBlock(blocks) {
  console.log('finnishOneResourceBlock blocks=<',blocks,'>');
  if(!blocks.finnish) {
    return;
  }
  //console.log('finnishOneResourceBlock oneBlockWords=<',oneBlockWords,'>');
  let oneBlockWordsStr = JSON.stringify(oneBlockWords);
  //console.log('finnishOneResourceBlock oneBlockWordsStr=<',oneBlockWordsStr,'>');
  const msgBuff = Buffer.from(oneBlockWordsStr);
  ipfs.add(msgBuff, function (err, files) {
    if(err) {
      throw err;
    }
    console.log('finnishOneResourceBlock files=<',files,'>');
    if(files.length > 0) {
      let blockAnnounce = {
        input:blocks.cid,
        group:blocks.group,
        task:blocks.task,
        output:files[0].path,
        payment:cTestPaymentAddress
      };
      console.log('finnishOneResourceBlock blockAnnounce=<',blockAnnounce,'>');
      saveDoneDB(blockAnnounce);
      publishResult(blockAnnounce);
    }
  });
}

const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');
let dbTodo = level(dbBlockPathTodo);
let dbDone = level(dbBlockPathDone);
let stream = dbTodo.createReadStream();
//console.log('stream=<',stream,'>');
stream.on('data', function (data) {
  //console.log('data.key=<',data.key.toString('utf-8'),'>');
  //console.log('data.value=<',data.value.toString('utf-8'),'>');
  stream.pause();
  let blockCid = data.key.toString('utf-8');
  dbDone.get(blockCid, function (err, value) {
    if (err) {
      if (err.notFound) {
        console.log('blockCid=<',blockCid,'>');
        let taskJson = {block:blockCid,task:'wator.ipfs.ostrich.app'};
        pubRedis.publish(redisPubChannel,JSON.stringify(taskJson));
      } else {
        throw err;
      }
    } else {
      console.log('dbDone blockCid=<',blockCid,'>');
      stream.resume();
    }
  });
});

stream.on('error', function (err) {
  console.log('Oh my!', err);
});
stream.on('close', function () {
  console.log('Stream closed');
});
stream.on('end', function () {
  console.log('Stream ended');
  writeBlock();
});

function saveDoneDB(result) {
  //console.log('saveDoneDB result=<',result,'>');
  dbDone.put(result.input,JSON.stringify(result));
}

function publishResult(blockResult) {
  console.log('publishResult blockResult=<',blockResult,'>');
  let outputCID = blockResult.output;
  console.log('publishResult outputCID=<',outputCID,'>');
  console.log('publishResult blockResult=<',blockResult,'>');
}


const SHA3  = require('sha3');
const fs = require('fs');
const crypto = require('crypto');

const EC = require('elliptic').ec;
const ec = new EC('p521');
//console.log('ec=<',ec,'>');
const bs58 = require('bs58')



