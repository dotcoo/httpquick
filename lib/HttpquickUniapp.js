// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

import { HttpQuickBase } from './HttpQuickBase';

// uniapp 和 小程序 请求
class HttpQuick extends HttpQuickBase {

  methods = {};

  // 上传文件
  upload(opts) {
    return this.request({ ...opts, method: 'POST', func: 'uploadFile' });
  }

  // 下载文件
  download(opts) {
    return this.request({ ...opts, method: 'POST', func: 'downloadFile' });
  }

  // 发送请求
  async send(req, res) {
    let resolve = null, promise = new Promise((r) => resolve = r);

    // 发起请求
    this.methods[req.func || 'request']({
      method: req.method,
      url: req.fullUrl,
      header: req.headers,
      data: req.body,
      formData: req.formData, // upload fromData
      name: req.name || 'file', // upload file param name
      filePath: req.filePath, // upload file path
      responseType: req.responseType,
      dataType: req.dataType,
      timeout: req.timeout,
      success: res => resolve({ ...res, err: false }),
      fail: err => resolve({ ...err, err: true }),
    });

    // 响应
    const response = res.response = await promise;
    res.err = response.err;

    // 错误处理
    if (response.err && response.errMsg == 'request:fail timeout') {
      return this.onTimeoutError(req, res);
    } else if (response.err) {
      return this.onNetworkError(req, res);
    }

    // 非200
    if (response.statusCode != 200) { return this.onNetworkError(req, res); }

    // 响应行
    res.status = response.statusCode;
    res.statusText = 'OK';

    // 响应头
    for (const name in response.header) {
      res.headers[name.toLowerCase()] = response.header[name];
    }

    // 响应体
    if (req.responseType == 'text' && req.dataType == 'json' && typeof response.data == 'string') {
      res.body = (JSON.parse0 || JSON.parse)(response.data);
    } else if (req.responseType == 'text' && req.dataType == 'json' && typeof response.data == 'object') {
      res.body = response.data?.object2model() ?? response.data;
    } else if (req.responseType == 'text') {
      res.body = response.data;
    } else {
      res.body = response.data;
    }
  }
}

export {
  HttpQuickBase,
  HttpQuick,
};
