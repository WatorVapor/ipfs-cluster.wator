const WebSocket = require('ws');
const config = {port: 19083 }
const wss = new WebSocket.Server(config);
wss.on('connection', function connection(ws) {
  //console.log('connection: ws=<', ws,'>');
  ws.on('message', function (msg) {
    //console.log('message: ws=<', ws,'>');
    try {
      let jsonMsg = JSON.parse(msg);
      //console.log('message: jsonMsg=<', jsonMsg,'>');
      let files = [];
      jsonMsg.forEach(function(val, i) {
        //console.log('message: val=<', val,'>');
        let file = {};
        file.path = val.path;
        file.content = Buffer.from(val.content, 'base64');
        files.push(file);
      });
      //console.log('message: files=<', files,'>');
      addFiles2IpfsStorage(files);
    } catch(e) {
      console.log('message: e=<', e,'>');
      console.log('message: msg=<', msg,'>');
    }
  });
  ws.on('error', function (evt) {
    console.log('error: evt=<', evt,'>');
  });
});

var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
console.log('ipfs=<',ipfs,'>');

ipfs.id(function (err, identity) {
  if (err) {
    throw err;
  }
  console.log('identity=<',identity,'>');
});


function addFiles2IpfsStorage(files) {
  ipfs.files.add(files,function(err, result){
    if (err) {
      throw err;
    }
    console.log('uploadSliceToIpfs::result=<',result,'>');
    setTimeout(function () { 
      sendBack2WS(result);
    },1);
  });
}

function sendBack2WS(result) {
  console.log('sendBack2WS::wss.clients=<',wss.clients,'>');
  wss.clients.forEach(function each(client) {
    console.log('sendBack2WS::client.readyState=<',client.readyState,'>');
    if (client.readyState) {
      client.send(JSON.stringify(result));
    };
  });
}
