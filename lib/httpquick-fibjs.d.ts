// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

/**
 * HTTP 请求选项接口
 */
interface HttpQuickRequest {
  /** 请求方法，如 GET、POST、PUT 等 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
  /** 基础 URL，会与 url 拼接 */
  baseUrl: string;
  /** 请求路径或完整 URL */
  url: string;
  /** 请求头信息 */
  headers: Record<string, string>;
  /** URL 查询参数 */
  query: Record<string, any>;
  /** JSON 格式的请求体 */
  json: Record<string, any>;
  /** 请求体数据 */
  body: any;
  /** 响应类型 */
  responseType: 'text' | 'json' | 'blob' | 'arraybuffer';
  /** 数据类型 */
  dataType: 'text' | 'json' | 'xml' | 'blob' | 'arraybuffer';
  /** 请求超时时间（毫秒） */
  timeout: number;
  /** 完整 URL，设置后会忽略 baseUrl 和 url */
  fullUrl: string;
  /** 其他自定义参数 */
  [key: string]: any;
}

/**
 * HTTP 响应选项接口
 */
interface HttpQuickResponse {
  /** 状态码 */
  status: number;
  /** 状态文本 */
  statusText: 'NONE';
  /** 响应头信息 */
  headers: Record<string, string>;
  /** 响应体数据 */
  body: any;
  /** 其他自定义参数 */
  [key: string]: any;
}

/**
 * HTTP 中间件 Next 接口
 */
interface HttpQuickNext {
  (req: HttpQuickRequest, res: HttpQuickResponse): void;
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
  (req: HttpQuickRequest, res: HttpQuickResponse, next: HttpQuickNext): void;
  (req: HttpQuickRequest, res: HttpQuickResponse): void;
}

/**
 * HTTP 请求基础类
 */
declare class HttpQuick {
  /**
   * 创建 HttpQuick 实例
   * @param config 配置参数
   */
  static new(): HttpQuick;
  static new(config: Partial<HttpQuickRequest>): HttpQuick;

  /** 配置参数 */
  config: Partial<HttpQuickRequest>;

  /** 中间件列表 */
  middlewares: HttpQuickMiddleware[];
  
  /**
   * 构造函数
   * @param config 配置参数
   */
  constructor();
  constructor(config: Partial<HttpQuickRequest>);
  
  /**
   * 更新配置
   * @param config 配置参数
   */
  updateConfig(config: Partial<HttpQuickRequest>) : void;
  
  /**
   * 添加中间件
   * @param middleware 中间件函数
   */
  addMiddleware(middleware: HttpQuickMiddleware): void;
  
  /**
   * 获取默认请求选项
   * @returns 默认请求选项
   */
  getDefaultRequest(): HttpQuickRequest;
  
  /**
   * 获取默认响应选项
   * @returns 默认响应选项
   */
  getDefaultResponse(): HttpQuickResponse;
  
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
  fillUrl(req: HttpQuickRequest): void;
  
  /**
   * 填充请求头
   * @param req 请求选项
   */
  fillHeaders(req: HttpQuickRequest): void;
  
  /**
   * 填充请求体
   * @param req 请求选项
   */
  fillBody(req: HttpQuickRequest): void;

  /**
   * 发送 GET 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  get(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 发送 POST 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  post(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 发送 PUT 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  put(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 发送 DELETE 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  delete(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 发送 PATCH 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  patch(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 发送 HEAD 请求
   * @param req 请求选项
   * @returns 响应结果
   */
  head(req: Partial<HttpQuickRequest>): HttpQuickResponse;

  /**
   * 上传文件
   * @param req 请求选项
   * @returns 响应结果
   */
  upload(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 下载文件
   * @param req 请求选项
   * @returns 响应结果
   */
  download(req: Partial<HttpQuickRequest>): HttpQuickResponse;

  /** 超时错误处理中间件 */
  onTimeoutError: HttpQuickMiddleware;

  /** 网络错误处理中间件 */
  onNetworkError: HttpQuickMiddleware

  /**
   * 发送请求
   * @param options 请求选项
   * @returns 响应结果
   */
  request(options: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 发送请求的抽象方法，子类必须实现
   * @param req 请求选项
   * @param res 响应选项
   */
  send(req: HttpQuickRequest, res: HttpQuickResponse): void;

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
 * HttpQuickConstructor 类定义
 */
type HttpQuickConstructor = typeof HttpQuick;

/**
 * 全局方法扩展
 */
declare global {
  /**
   * 全局 GET 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpGet(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局 POST 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpPost(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局 PUT 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpPut(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局 DELETE 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpDelete(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局 PATCH 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpPatch(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局 HEAD 请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpHead(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局上传方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpUpload(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局下载方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpDownload(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  
  /**
   * 全局请求方法
   * @param req 请求选项
   * @returns 响应结果
   */
  function httpRequest(req: Partial<HttpQuickRequest>): HttpQuickResponse;

  /**
   * Math 对象扩展
   */
  interface Math {
    /**
     * Math.get 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    get(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.post 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    post(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.put 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    put(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.delete 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    delete(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.patch 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    patch(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.head 请求方法
     * @param req 请求选项
     * @returns 响应结果
     */
    head(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.upload 方法
     * @param req 请求选项
     * @returns 响应结果
     */
    upload(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.download 方法
     * @param req 请求选项
     * @returns 响应结果
     */
    download(req: Partial<HttpQuickRequest>): HttpQuickResponse;
    
    /**
     * Math.request 方法
     * @param req 请求选项
     * @returns 响应结果
     */
    request(req: Partial<HttpQuickRequest>): HttpQuickResponse;
  }
}

/**
 * 导出类型定义
 */
export {
  HttpQuickRequest,
  HttpQuickResponse,
  HttpQuickNext,
  HttpQuickMiddleware,
  HttpQuick,
  HttpQuickConstructor,
};
