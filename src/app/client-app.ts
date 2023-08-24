import { omit } from "lodash";
import { pathToRegexp } from "path-to-regexp";
import * as qs from "qs";
import { Jsonifiable } from "type-fest";

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Endpoint {
    method: Method;
    url: string;
    payload?: Jsonifiable;
}

export interface _Endpoint extends Omit<Endpoint, 'url'> {
    method: Method;
    payload?: Jsonifiable;
    pathname: string;
    params: Array<string | number>;
    queryParams: Record<string, any>;
}

interface EndpointRegexp {
    method: Method;
    regexp: RegExp;
}

export type ClientWSCallback = (endpoint: _Endpoint) => void;

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
        const { pathname, search } = new URL(endpoint.url, location.origin);
        const dispatcher = this.dispatchers.find(({ endpoint: {method, regexp} }) => 
            endpoint.method === method && regexp.test(pathname)
        )
        if (dispatcher) {
            const params = this.parseParams(dispatcher.endpoint.regexp, pathname);
            dispatcher.callback({ ...omit(endpoint, 'url'), pathname, params, queryParams: qs.parse(search.substring(1)) });
        }
    }
    
    private parseParams(regexp: RegExp, pathname: string) {
        return regexp.exec(pathname)?.length ? regexp.exec(pathname)!.slice(1).map(param => {
            try {
                return JSON.parse(param);
            } catch {
                return param;
            }
        }) : []
    }

    private registerRoute(method: Method, path: string, callback: ClientWSCallback) {
        this.dispatchers.push({ endpoint: { method, regexp: pathToRegexp(path)}, callback });
    }
}
