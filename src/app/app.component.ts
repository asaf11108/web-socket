import { Component, OnInit } from '@angular/core';
import  { WebSocketServer } from 'ws';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-socket';

  ngOnInit(): void {
    this.initWebSocketServer()
  }

  private initWebSocketServer() {
    const wss = new WebSocketServer({ port: 8080 });

    wss.on('error', console.error);

    wss.on('open', function open(ws) {
      ws.send('something');
    });

    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        ws.send('test');
      });

      ws.send('hello from the server!');
    });
  }
}
