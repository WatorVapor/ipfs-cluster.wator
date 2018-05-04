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
      if(jsonMsg.train && jsonMsg.train.upload) {
        let files = [];
        jsonMsg.train.upload.forEach(function(val, i) {
          //console.log('message: val=<', val,'>');
          let file = {};
          file.path = val.path;
          file.content = Buffer.from(val.content, 'base64');
          files.push(file);
        });
        //console.log('message: files=<', files,'>');
        addFiles2IpfsStorage(files,ws);
      }
      if(jsonMsg.tts && jsonMsg.tts.download) {
        let file = jsonMsg.tts.download;
        console.log('message: file=<', file,'>');
        getFiles4IpfsStorage(file,ws);
      }
      
    } catch(e) {
      console.log('message: e=<', e,'>');
      console.log('message: msg=<', msg,'>');
    }
  });
  
  ws.on('error', function (evt) {
    console.log('error: evt=<', evt,'>');
  });

  ws.isAlive = true;
  ws.on('pong', heartbeat);
});


function noop() {}
function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);




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


function addFiles2IpfsStorage(files,ws) {
  console.log('uploadSliceToIpfs::files=<',files,'>');
  if(files && files.length > 0) {
    ipfs.files.add(files,function(err, result){
      if (err) {
        throw err;
        process.exit();
      }
      console.log('uploadSliceToIpfs::result=<',result,'>');
      setTimeout(function () { 
        sendBack2WS(result,ws);
      },1);
    });
  } else {
    setTimeout(function () { 
      sendBack2WS([],ws);
    },1);
  }
}

function sendBack2WS(result,ws) {
  //console.log('sendBack2WS::wss.clients=<',wss.clients,'>');
  /*
  wss.clients.forEach(function each(client) {
    console.log('sendBack2WS::client.readyState=<',client.readyState,'>');
    if (client.readyState) {
      client.send(JSON.stringify(result));
    };
  });
  */
  if (ws.readyState) {
    ws.send(JSON.stringify(result));
  };
}

/*
function getFiles4IpfsStorage(file,ws) {
  console.log('getFiles4IpfsStorage::file=<',file,'>');
  if(file) {
    ipfs.files.cat(file,function(err, result){
      if (err) {
        throw err;
        process.exit();
      }
      getFiles4IpfsStorage2(file,ws);
    });
  } else {
    setTimeout(function () { 
      sendBackFile2WS({},file,ws);
    },1);
  }
}
*/


function getFiles4IpfsStorage(file,ws) {
  console.log('getFiles4IpfsStorage::file=<',file,'>');
  if(file) {
    ipfs.files.cat(file,function(err, result){
      if (err) {
        throw err;
        process.exit();
      }
      console.log('getFiles4IpfsStorage::result.length=<',result.length,'>');
      console.log('getFiles4IpfsStorage::result=<',result,'>');
      setTimeout(function () { 
        sendBackFile2WS(result,file,ws);
      },1);
    });
  } else {
    setTimeout(function () { 
      sendBackFile2WS({},file,ws);
    },1);
  }
}



function sendBackFile2WS(result,file,ws) {
  if (ws.readyState) {
    let res = { clip:file,result:result};
    ws.send(JSON.stringify(res));
  };
}
