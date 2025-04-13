// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

import { HttpQuickBase } from './HttpQuickBase';

// fetch 请求
class HttpQuick extends HttpQuickBase {
  // 发送请求
  async send(req, res) {
    try {
      // 超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), req.timeout);

      // 参数
      const init = {
        method: req.method,
        headers: req.headers,
        cache: 'no-cache',
        signal: controller.signal,
        body: req.method == 'POST' || req.method == 'PUT' ? req.body : null,
      };

      // 发起 fetch 请求
      const response = res.response = await fetch(req.fullUrl, init);
      clearTimeout(timeoutId);

      // 非200
      if (response.status != 200) { return this.onNetworkError(req, res, null); }

      // 响应行
      res.status = response.status;
      res.statusText = response.statusText;

      // 响应头
      for (let [name, values] of response.headers.entries()) {
        name = name.toLowerCase();
        for (const value of values.split(', ')) {
          res.headers[name] = value;
        }
      }

      // 响应体
      if (req.responseType == 'text' && req.dataType == 'json') {
        res.body = await response.json();
      } else if (req.responseType == 'text') {
        res.body = await response.text();
      } else {
        res.body = response.body;
      }
    } catch (err) {
      if (err.code == 20) {
        return this.onTimeoutError(req, res, err)
      } else {
        return this.onNetworkError(req, res, err);
      }
    }
  }
}

export {
  HttpQuickBase,
  HttpQuick,
};
