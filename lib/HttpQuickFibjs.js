// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

import { HttpQuickBase } from './HttpQuickBase';
import http from 'http';
import util from 'util';

// Ajax 请求
export class HttpQuickFibjs extends HttpQuickBase {
  // 发送请求
  send(req, res) {
    try {
      const response = http.request(req.method, req.fullUrl, {
        headers: req.headers,
        body: req.body || '',
      });

      // 非200
      if (response.status !== 200) {
        return this.onNetworkError(req, res, null);
      }

      // 响应行
      res.status = response.statusCode;
      res.statusText = response.statusMessage;

      // 响应头
      for (let name of response.headers.keys()) {
        const values = response.headers.all(name);
        name = name.toLowerCase();
        for (const value of values) {
          res.headers[name] = value;
        }
      }

      // 响应体
      if (req.responseType == 'text' && req.dataType == 'json') {
        res.body = Buffer.isBuffer(response.data) ? JSON.parse(response.data.toString('utf8')) : typeof response.data == 'string' ? JSON.parse(response.data) : response.data;
      } else if (req.responseType == 'text') {
        res.body = response.data.toString('utf8');
      } else {
        res.body = response.data;
      }
    } catch (err) { // 错误处理
      return this.onTimeoutError(req, res, err)
    }
  }

  // 同步请求
  request(options) {
    return util.sync(async (options) => await super.request(options))(options);
  }
}
