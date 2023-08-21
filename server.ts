import { Endpoint } from './src/app/client-app.ts';
import {WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('error', console.error);

wss.on('connection', function open(ws) {

  ws.on('message', function message(data) {
    console.log('received: ', data);
  });

  setTimeout(() => test(ws), 5000);
});

function test(ws: WebSocket) {
  const endpoint: Endpoint = {
    method: 'POST',
    url: '/api/users/1'
  };
  ws.send(JSON.stringify(endpoint));
}