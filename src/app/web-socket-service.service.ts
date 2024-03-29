import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ClientWS, Endpoint } from './client-app';
import { Jsonifiable } from 'type-fest';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  clientApp = new ClientWS();
  private socket$!: WebSocketSubject<any>;

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({ url: 'ws://localhost:3001' });

      this.socket$.subscribe((endpoint: Endpoint) => {
        this.clientApp.dispatch(endpoint);
      });
    }
  }

  sendMessage(json: Jsonifiable) {
    this.socket$.next(json);
  }

  close() {
    this.socket$.complete();
  }
}
