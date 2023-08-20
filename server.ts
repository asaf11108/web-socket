import {WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('error', console.error);

wss.on('connection', function open(ws) {
  // ws.send(JSON.stringify({msg: 'something'}));

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
});

