import { pathToRegexp } from "path-to-regexp";

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Endpoint {
    method: Method;
    url: string;
    payload?: JSON;
}

export interface EndpointPath {
    method: Method;
    path: string;
}

interface EndpointRegexp {
    method: Method;
    regexp: RegExp;
}

export type ClientWSCallback = (endpoint: Endpoint, sendMessage: (json: JSON) => void) => void;

export interface ClientWSDispatcher {
    endpoint: EndpointRegexp;
    callback: ClientWSCallback;
}

export class ClientWS {
    private dispatchers: ClientWSDispatcher[] = [];

    constructor(private sendMessage: (json: JSON) => void) {}

    post({ method, path }: EndpointPath, callback: ClientWSCallback) {
        this.dispatchers.push({ endpoint: { method, regexp: pathToRegexp(path)}, callback });
    }

    dispatch(endpoint: Endpoint) {
        const dispatcher = this.dispatchers.find(({ endpoint: {method, regexp} }) => 
            endpoint.method === method && regexp.test(endpoint.url)
        )
        if (dispatcher)
            dispatcher.callback(endpoint, this.sendMessage);
    }
}
