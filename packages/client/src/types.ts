import type {
  RequestMethod,
  Router,
  BaseRoutes,
  GuardedPayload,
  GuardedResponse,
} from '@withtyped/server';

export type ClientPayload = {
  params?: Record<string, string>;
  search?: Record<string, string | string[]>;
  body?: unknown;
};

export type RouterRoutes<RouterInstance extends Router> = RouterInstance extends Router<
  infer Routes
>
  ? Routes
  : never;

type EmptyPayloadRoutes<MethodRoutes> = {
  [K in keyof MethodRoutes]: keyof GuardedPayload<MethodRoutes[K]> extends never ? K : never;
}[keyof MethodRoutes];

export type ClientRequestHandler<MethodRoutes> = {
  <T extends EmptyPayloadRoutes<MethodRoutes>>(path: T): Promise<GuardedResponse<MethodRoutes[T]>>;
  <T extends Exclude<keyof MethodRoutes, EmptyPayloadRoutes<MethodRoutes>>>(
    path: T,
    // It's by design. We need to remove the second argument when path has no payload needed.
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    payload: GuardedPayload<MethodRoutes[T]>
  ): Promise<GuardedResponse<MethodRoutes[T]>>;
};

export type RouterClient<Routes extends BaseRoutes> = {
  [key in Lowercase<RequestMethod>]: ClientRequestHandler<Routes[key]>;
};

export type ClientConfig = {
  baseUrl: URL;
  headers?:
    | Record<string, string>
    | ((url: URL, method: Lowercase<RequestMethod>) => Record<string, string>);
  keepAlive: boolean;
};

export type ClientConfigInit = {
  /** Base URL to prepend for every request. Only host and pathname will be applied. */
  baseUrl: string | URL;
  /** Additional headers to append for every request, also accepts a function that returns headers. */
  headers?:
    | Record<string, string>
    | ((url: URL, method: Lowercase<RequestMethod>) => Record<string, string>);
  /** If `Connection: keep-alive` header is appended for every request. Default to `true`. */
  keepAlive?: boolean;
};

export { type RequestMethod } from '@withtyped/server/lib/request.js';
