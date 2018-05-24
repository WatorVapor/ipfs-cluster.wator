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

const broadcastTopic = 'wai-ipfs-task-switch-created';

// cnwiki blocks
const taskTopBlocks = 'QmXbWfmEm7z43rdXyMp3XdT8yKViLgJvkwEmLCv3iWS1zP';
ipfs.files.get(taskTopBlocks,(err,files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    //console.log(file.path)
    //console.log(file.content.toString('utf8'));
    let blockJson = JSON.parse(file.content.toString('utf8'));
    broadCastBlocks(blockJson);
  })
})

function broadCastBlocks(block) {
  console.log('broadCastBlocks block=<',block,'>');
}

