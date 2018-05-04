const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
//var ipfs = ipfsAPI('master.ipfs.wator.xyz', '5001', {protocol: 'http'});

ipfs.config.set('Datastore.StorageMax','32GB',(err, reply) => {
  if (err) {
    throw err
  }
  console.log('set::reply=<',reply,'')
})


ipfs.config.get('Datastore.StorageMax',(err, config) => {
  if (err) {
    throw err
  }
  console.log('get::config=<',config,'')
})
