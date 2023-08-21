import { Component, OnDestroy } from '@angular/core';
import { WebSocketServiceService } from './web-socket-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'web-socket';

  constructor(public webSocketService: WebSocketServiceService) {
    this.registerPost();
    this.webSocketService.connect();
  }

  registerPost() {
    this.webSocketService.clientApp.post('/api/users/:id', (endpoint) => {
      console.log('registerPost: ', endpoint);
      this.webSocketService.sendMessage({ status: 200 });
    });
  }

  ngOnDestroy() {
    this.webSocketService.close();
  }
}
