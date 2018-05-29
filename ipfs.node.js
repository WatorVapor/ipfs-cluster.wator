const IPFS = require('./src/index.js');
const node = new IPFS({});
node.on('error', error => {
  console.error(error.message)
});
console.log('node=<',node,'>');
