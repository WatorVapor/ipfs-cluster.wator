const IPFS = require('ipfs');
const node = new IPFS({});
node.on('error', error => {
  console.error(error.message)
});
console.log('node=<',node,'>');
