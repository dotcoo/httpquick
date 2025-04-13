// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

// 请求对象
class HttpQuickBase {

  // 默认请求
  config = {};

  // 请求编号 debug使用的
  requestId = 0;

  // 请求中间件
  middlewares = [];

  // 构造函数
  constructor(config = {}) {
    Object.assign(this.config, config);
  }

  // 更新配置
  updateConfig(config = {}) {
    Object.assign(this.config, config);
  }

  // 添加中间件
  addMiddleware(m) {
    this.middlewares.push(m.bind(this));
  }

  // 获取默认请求结构
  getDefaultRequest() {
    return {
      id: 0,
      baseUrl: '',
      method: 'GET',
      url: '/',
      headers: {},
      query: null,
      json: null,
      body: null,
      responseType: 'text',
      dataType: 'json',
      timeout: 60000,
      fullUrl: '',
    };
  }

  // 获取默认响应结构
  getDefaultResponse() {
    return {
      status: -1,
      statusText: 'NONE',
      headers: {},
      body: null,
    };
  }

  // 对象转请求字符串
  obj2query(obj) {
    return typeof URLSearchParams !== 'undefined' ? new URLSearchParams(obj).toString() : Object.entries(obj).map(([key, val]) => encodeURIComponent(key) + '=' + encodeURIComponent(val)).join('&');
  }

  // 填充请求行
  fillUrl(req) {
    req.fullUrl = (/^https?:\/\//.test(req.url) ? req.url : req.baseUrl + req.url) + (req.query ? '?' + this.obj2query(req.query) : '');
  }

  // 填充请求头
  fillHeaders(req) {
    if (req.responseType == 'text' && req.dataType == 'json') { req.headers.Accept = 'application/json'; }
  }

  // 填充请求体
  fillBody(req) {
    if (!(req.method == 'POST' || req.method == 'PUT')) { return; }
    if (req.filePath) { // uniapp 小程序
      // noop
    } else if (req.body !== null && typeof FormData !== 'undefined' && req.body instanceof FormData) {
      if (typeof process != 'undefined' && (process?.versions?.node ?? '0.0.0') !== '0.0.0') { // node
        req.headers['content-type'] = req.body.getContentType();
        req.body = req.body.toStream();
      }
    } else if (req.body !== null && typeof URLSearchParams !== 'undefined' && req.body instanceof URLSearchParams) {
      req.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      req.body = req.body.toString();
    } else if (req.body !== null && Array.isArray(req.body)) {
      req.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      req.body = req.body.map(v => encodeURIComponent(v.key) + '=' + encodeURIComponent(v.val)).join('&');
    } else if (req.body !== null && Object.isObject(req.body)) {
      req.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      req.body = this.obj2query(req.body);
    } else if (req.json !== null) {
      req.headers['content-type'] = 'application/json; charset=utf-8';
      req.body = JSON.stringify(req.json);
    } else {
      req.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      req.body = '';
    }
  }

  // get请求
  get(req) {
    return this.request({ ...req, method: 'GET' });
  }

  // post请求
  post(req) {
    return this.request({ ...req, method: 'POST' });
  }

  // put请求
  put(req) {
    return this.request({ ...req, method: 'PUT' });
  }

  // delete请求
  del(req) {
    return this.request({ ...req, method: 'DELETE' });
  }

  // upload请求
  upload(req) {
    return new Error('unreachable');
  }

  // download请求
  download(req) {
    return new Error('unreachable');
  }

  // 超时错误处理
  onTimeoutError = function(req, res, err) {
    console.error('http timeout', err);
    res.status = -4;
    res.statusText = 'TIMEOUT';
    if (req.responseType == 'text' && req.dataType == 'json') {
      res.body = { errno: -1, errmsg: res.response.status + ', 网络请求超时!' };
    } else {
      res.body = '网络请求超时!';
    }
  };

  // 网络错误处理
  onNetworkError(req, res, err) {
    console.error('http error', err);
    res.status = -1;
    res.statusText = 'NETWORK FAIL';
    if (req.responseType == 'text' && req.dataType == 'json') {
      res.body = { errno: -2, errmsg: res.response.status + ', 网络请求错误!' };
    } else {
      res.body = '网络请求错误!';
    }
  }

  // 请求
  async request(request) {
    // 默认值
    const req = Object.assign(this.getDefaultRequest(), this.config, request);
    let res = this.getDefaultResponse();

    // 处理
    req.method = req.method.toUpperCase();
    Object.defineProperties(req, {
      response: { value: res, enumerable: false, configurable: true, writable: true },
    });
    Object.defineProperties(res, {
      request: { value: req, enumerable: false, configurable: true, writable: true },
      response: { value: null, enumerable: false, configurable: true, writable: true },
      parent: { value: null, enumerable: false, configurable: true, writable: true },
    });

    // 补全
    this.fillUrl(req);
    this.fillHeaders(req);
    this.fillBody(req);

    // 中间件
    let handle = async (req, res) => await this.send(req, res);
    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const next = handle;
      const middleware = this.middlewares[i].bind(this);
      handle = async (req, res) => await middleware(req, res, next);
    }

    // 发送请求
    await handle(req, res);

    return res;
  }

  // 发送发送请求 abstract方法 需要子类实现
  send(req, res) {
    // 实现发送请求

    // 业务代码
    // errno -2 请求异常, 状态码非2xx
    // errno -1 请求超时
    // errno 0 正常
    // errno 1 错误
    // errno 2 未登录
  }

  install(app, options = {}) {
    app.config.globalProperties.$http = this;
    for (const key in options) {
      this[key] = options[key];
    }
  }

  globalMethods() {
    globalThis.httpGet = this.get.bind(this);
    globalThis.httpPost = this.post.bind(this);
    globalThis.httpPut = this.put.bind(this);
    globalThis.httpDelete = this.del.bind(this);
    globalThis.httpUpload = this.upload.bind(this);
    globalThis.httpDownload = this.download.bind(this);
  }
}

export {
  HttpQuickBase,
};
