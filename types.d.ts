interface HttpQuickRequestOptions {
  method?: string;
  baseUrl?: string;
  url: string;
  headers?: Record<string, string>;
  query?: any;
  json?: any;
  body?: any;
  responseType?: 'text' | 'json' | 'blob' | 'arraybuffer';
  dataType?: 'json' | 'text' | 'xml' | 'blob' | 'arraybuffer';
  timeout?: number;
  fullUrl?: '';
  [key: string]: any;
}

interface HttpQuickResponseOptions {
  status?: number;
  statusText?: 'NONE';
  headers?: Record<string, string>;
  body: any;
  [key: string]: any;
}

interface HttpQuickMiddleware {
  (req: HttpQuickRequestOptions, res: HttpQuickResponseOptions, next?: (req: HttpQuickRequestOptions, res: HttpQuickResponseOptions) => Promise<void>): Promise<void>;
}

interface HttpQuickBaseConstructor {
  new(config?: Record<string, any>): HttpQuickBase;
}

declare abstract class HttpQuickBase {
  config: Record<string, string>;
  middlewares: HttpQuickMiddleware[];
  constructor(config?: Record<string, any>);
  updateConfig(config?: Record<string, any>) : void;
  addMiddleware(middleware: HttpQuickMiddleware): void;
  getDefaultRequest(): HttpQuickRequestOptions;
  getDefaultResponse(): HttpQuickResponseOptions;
  obj2query(obj: Record<string, any>): string;
  fillUrl(req: HttpQuickRequestOptions): void;
  fillHeaders(req: HttpQuickRequestOptions): void;
  fillBody(req: HttpQuickRequestOptions): void;

  get(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  post(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  put(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  delete(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  patch(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  head(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;

  upload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  download(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;

  onTimeoutError: HttpQuickMiddleware;
  onNetworkError: HttpQuickMiddleware

  request(options: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  abstract send(req: HttpQuickRequestOptions, res: HttpQuickResponseOptions): Promise<void>;

  install(app: any, options?: Record<string, any>): void;

  globalMethods(): void;
  mathMethods(): void;
}

interface HttpQuickConstructor {
  new(config?: Record<string, any>): HttpQuick;
}

declare class HttpQuick extends HttpQuickBase {
  constructor(config?: Record<string, any>);
  send(req: HttpQuickRequestOptions, res: HttpQuickResponseOptions): Promise<void>;
}

declare global {
  function httpGet(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpPost(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpPut(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpDelete(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpPatch(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpHead(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpUpload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpDownload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  function httpRequest(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;

  interface Math {
    get(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    post(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    put(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    delete(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    patch(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    head(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    upload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    download(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    request(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  }
}

export {
  HttpQuickRequestOptions,
  HttpQuickResponseOptions,
  HttpQuickMiddleware,
  HttpQuickBaseConstructor,
  HttpQuickBase,
  HttpQuickConstructor,
  HttpQuick,
};
