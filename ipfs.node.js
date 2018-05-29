const IPFS = require('./src/index.js');
const option = {
  EXPERIMENTAL:{
    pubsub:true,
    sharding:true,
    dht:true
  }
};
const node = new IPFS();
node.on('error', error => {
  console.error(error.message)
});

node.on('ready', () => {
  console.log('node=<',node,'>');
});

