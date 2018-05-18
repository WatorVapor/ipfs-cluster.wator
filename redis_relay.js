
var ipfsAPI = require('ipfs-api');
//var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
var ipfs = ipfsAPI('localhost', '5002', {protocol: 'http'})
console.log('ipfs=<',ipfs,'>');

ipfs.id(function (err, identity) {
  if (err) {
    throw err;
    process.exit();
  }
  console.log('identity=<',identity,'>');
});

