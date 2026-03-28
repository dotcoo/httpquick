/**
 * HTTP 请求选项接口
 */
interface HttpQuickRequestOptions {
  /** 请求方法，如 GET、POST、PUT 等 */
  method?: string;
  /** 基础 URL，会与 url 拼接 */
  baseUrl?: string;
  /** 请求路径或完整 URL */
  url: string;
  /** 请求头信息 */
  headers?: Record<string, string>;
  /** URL 查询参数 */
  query?: any;
  /** JSON 格式的请求体 */
  json?: any;
  /** 请求体数据 */
  body?: any;
  /** 响应类型 */
  responseType?: 'text' | 'json' | 'blob' | 'arraybuffer';
  /** 数据类型 */
  dataType?: 'json' | 'text' | 'xml' | 'blob' | 'arraybuffer';
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 完整 URL，设置后会忽略 baseUrl 和 url */
  fullUrl?: '';
  /** 其他自定义参数 */
  [key: string]: any;
}

/**
 * HTTP 响应选项接口
 */
interface HttpQuickResponseOptions {
  /** 状态码 */
  status?: number;
  /** 状态文本 */
  statusText?: 'NONE';
  /** 响应头信息 */
  headers?: Record<string, string>;
  /** 响应体数据 */
  body: any;
  /** 其他自定义参数 */
  [key: string]: any;
}

/**
 * HTTP 中间件接口
 */
interface HttpQuickMiddleware {
  /**
   * 中间件函数
   * @param req 请求选项
   * @param res 响应选项
   * @param next 下一个中间件函数
   */
  (req: HttpQuickRequestOptions, res: HttpQuickResponseOptions, next?: (req: HttpQuickRequestOptions, res: HttpQuickResponseOptions) => Promise<void>): Promise<void>;
}

/**
 * HttpQuickBase 构造函数接口
 */
interface HttpQuickBaseConstructor {
  /**
   * 创建 HttpQuickBase 实例
   * @param config 配置参数
   */
  new(config?: Record<string, any>): HttpQuickBase;
}

/**
 * HTTP 请求基础类
 */
declare abstract class HttpQuickBase {
  /** 配置参数 */
  config: Record<string, string>;
  /** 中间件列表 */
  middlewares: HttpQuickMiddleware[];
  
  /**
   * 构造函数
   * @param config 配置参数
   */
  constructor(config?: Record<string, any>);
  
  /**
   * 更新配置
   * @param config 配置参数
   */
  updateConfig(config?: Record<string, any>) : void;
  
  /**
   * 添加中间件
   * @param middleware 中间件函数
   */
  addMiddleware(middleware: HttpQuickMiddleware): void;
  
  /**
   * 获取默认请求选项
   * @returns 默认请求选项
   */
  getDefaultRequest(): HttpQuickRequestOptions;
  
  /**
   * 获取默认响应选项
   * @returns 默认响应选项
   */
  getDefaultResponse(): HttpQuickResponseOptions;
  
  /**
   * 对象转查询字符串
   * @param obj 要转换的对象
   * @returns 查询字符串
   */
  obj2query(obj: Record<string, any>): string;
  
  /**
   * 填充 URL
   * @param req 请求选项
   */
  fillUrl(req: HttpQuickRequestOptions): void;
  
  /**
   * 填充请求头
   * @param req 请求选项
   */
  fillHeaders(req: HttpQuickRequestOptions): void;
  
  /**
   * 填充请求体
   * @param req 请求选项
   */
  fillBody(req: HttpQuickRequestOptions): void;

  /**
   * 发送 GET 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  get(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 发送 POST 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  post(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 发送 PUT 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  put(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 发送 DELETE 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  delete(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 发送 PATCH 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  patch(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 发送 HEAD 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  head(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;

  /**
   * 上传文件
   * @param req 请求选项
   * @returns 响应结果
   */
  upload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 下载文件
   * @param req 请求选项
   * @returns 响应结果
   */
  download(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;

  /** 超时错误处理中间件 */
  onTimeoutError: HttpQuickMiddleware;
  /** 网络错误处理中间件 */
  onNetworkError: HttpQuickMiddleware

  /**
   * 发送请求
   * @param options 请求选项
   * @returns 响应结果
   */
  request(options: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 发送请求的抽象方法，子类必须实现
   * @param req 请求选项
   * @param res 响应选项
   */
  abstract send(req: HttpQuickRequestOptions, res: HttpQuickResponseOptions): Promise<void>;

  /**
   * 安装到应用
   * @param app 应用实例
   * @param options 安装选项
   */
  install(app: any, options?: Record<string, any>): void;

  /**
   * 添加全局方法
   */
  globalMethods(): void;
  
  /**
   * 添加 Math 对象方法
   */
  mathMethods(): void;
}

/**
 * HttpQuick 构造函数接口
 */
interface HttpQuickConstructor {
  /**
   * 创建 HttpQuick 实例
   * @param config 配置参数
   */
  new(config?: Record<string, any>): HttpQuick;
}

/**
 * HTTP 请求实现类
 */
declare class HttpQuick extends HttpQuickBase {
  /**
   * 构造函数
   * @param config 配置参数
   */
  constructor(config?: Record<string, any>);
  
  /**
   * 发送请求的实现
   * @param req 请求选项
   * @param res 响应选项
   */
  send(req: HttpQuickRequestOptions, res: HttpQuickResponseOptions): Promise<void>;
}

/**
 * 全局方法扩展
 */
declare global {
  /**
   * 全局 GET 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpGet(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局 POST 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpPost(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局 PUT 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpPut(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局 DELETE 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpDelete(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局 PATCH 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpPatch(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局 HEAD 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpHead(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局上传方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpUpload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局下载方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpDownload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  
  /**
   * 全局请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpRequest(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;

  /**
   * Math 对象扩展
   */
  interface Math {
    /**
     * Math.get 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    get(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.post 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    post(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.put 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    put(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.delete 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    delete(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.patch 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    patch(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.head 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    head(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.upload 方法
     * @param req 请求选项
     * @returns 响应结果
     */
    upload(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.download 方法
     * @param req 请求选项
     * @returns 响应结果
     */
    download(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
    
    /**
     * Math.request 方法
     * @param req 请求选项
     * @returns 响应结果
     */
    request(req: HttpQuickRequestOptions): Promise<HttpQuickResponseOptions>;
  }
}

/**
 * 导出类型定义
 */
export {
  HttpQuickRequestOptions,
  HttpQuickResponseOptions,
  HttpQuickMiddleware,
  HttpQuickBaseConstructor,
  HttpQuickBase,
  HttpQuickConstructor,
  HttpQuick,
};
