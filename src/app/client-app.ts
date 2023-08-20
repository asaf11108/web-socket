
export interface Endpoint {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    payload?: JSON;
}

export type _Endpoint = Omit<Endpoint, 'payload'>;

export type ClientWSCallback = (endpoint: Endpoint, sendMessage: (message: string) => void) => void;

export interface ClientWSDispatcher {
    endpoint: _Endpoint;
    callback: ClientWSCallback;
}

export class ClientWS {
    dispatchers: ClientWSDispatcher[] = [];

    constructor(private sendMessage: (message: string) => void) {}

    post(endpoint: _Endpoint, callback: ClientWSCallback) {
        this.dispatchers.push({ endpoint, callback });
    }

    dispatch(endpoint: Endpoint) {
        const dispatcher = this.dispatchers.find(({ endpoint: {method, url} }) => 
            endpoint.method === method && endpoint.url === url
        )
        if (dispatcher)
            dispatcher.callback(endpoint, this.sendMessage);
    }
}
