const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
//const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/9090');
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


const watchTopic = 'wai-ipfs-task-switch-finnished';

const receiveMsg = (msg) => {
  console.log('receiveMsg msg=<',msg,'>');
  //console.trace();
}
ipfs.pubsub.subscribe(watchTopic, receiveMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe watchTopic=<',watchTopic,'>');
});

ipfs.pubsub.peers(watchTopic, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${topic}`, err)
  }
  console.log(peerIds)
})


const broadcastTopic = 'wai-ipfs-task-switch-created';


function broadCastBlocks(block,id) {
  //console.log('broadCastBlocks block=<',block,'>');
  console.log('broadCastBlocks id=<',id,'>');
  let broadcastTask = {block:id,task:'wator.ipfs.ostrich.app'};
  let taskStr = JSON.stringify(broadcastTask);
  console.log('broadCastBlocks taskStr=<',taskStr,'>');
  const msgBuff = Buffer.from(taskStr);
  ipfs.pubsub.publish(broadcastTopic, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    console.log('sented msgBuff=<',msgBuff,'>');
  });
  
  /*
  if(block.prev){
    if(block.prev.startsWith('Qm')) {
      getOneBlock(block.prev);
    } else {
      let genisis = block.prev;
      console.log('broadCastBlocks genisis=<',genisis,'>');
    }
  }
  */
}

function getOneBlock(block) {
  ipfs.files.get(block,(err,files) => {
    if (err) {
      throw err;
    }
    files.forEach((file) => {
      //console.log(file.path)
      //console.log(file.content.toString('utf8'));
      let blockJson = JSON.parse(file.content.toString('utf8'));
      broadCastBlocks(blockJson,file.path);
    })
  })
}

// cnwiki blocks
const taskTopBlocks = 'QmXbWfmEm7z43rdXyMp3XdT8yKViLgJvkwEmLCv3iWS1zP';

getOneBlock(taskTopBlocks);
