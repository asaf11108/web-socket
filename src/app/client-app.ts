import { pathToRegexp } from "path-to-regexp";

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Endpoint {
    method: Method;
    url: string;
    payload?: JSON;
}

interface EndpointRegexp {
    method: Method;
    regexp: RegExp;
}

export type ClientWSCallback = (endpoint: Endpoint) => void;

export interface ClientWSDispatcher {
    endpoint: EndpointRegexp;
    callback: ClientWSCallback;
}

export class ClientWS {
    private dispatchers: ClientWSDispatcher[] = [];

    post(path: string, callback: ClientWSCallback) {
        this.registerRoute('POST', path, callback);
    }
    
    dispatch(endpoint: Endpoint) {
        const dispatcher = this.dispatchers.find(({ endpoint: {method, regexp} }) => 
            endpoint.method === method && regexp.test(endpoint.url)
        )
        if (dispatcher)
            dispatcher.callback(endpoint);
    }

    private registerRoute(method: Method, path: string, callback: ClientWSCallback) {
        this.dispatchers.push({ endpoint: { method, regexp: pathToRegexp(path)}, callback });
    }
}
