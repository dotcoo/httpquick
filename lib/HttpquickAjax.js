// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

import { HttpQuickBase } from './HttpQuickBase';

// Ajax 请求
class HttpQuick extends HttpQuickBase {
  // 发送请求
  send(req, res) {
    let resolve = null, promise = new Promise((r) => resolve = r);

    // 创建 xhr 对象
    const xhr = res.response = new XMLHttpRequest();

    // 打开请求
    xhr.open(req.method, req.fullUrl, true);
    // 超时时间
    xhr.timeout = req.timeout;
    // 跨域授权 cookies, authorization
    xhr.withCredentials = req.withCredentials || false;
    // 响应结果类型
    xhr.responseType = req.responseType;
    // 设置请求头
    for (const [name, value] of Object.entries(req.headers)) {
      xhr.setRequestHeader(name, value);
    }

    // 超时处理
    xhr.ontimeout = (err) => {
      this.onTimeoutError(req, res, err);
      resolve();
    };

    // 错误处理
    xhr.onerror = (err) => {
      this.onNetworkError(req, res, err);
      resolve();
    };

    // 上传进度
    req.onprocess && xhr.upload.addEventListener('progress', req.onprocess);

    // 响应处理
    xhr.onreadystatechange = () => {
      // 过滤非 DONE 状态
      if (xhr.readyState !== 4 || xhr.status == 0) { return; }

      // 非200
      if (xhr.status != 200) { this.onNetworkError(req, res, null); return resolve(); }

      // 响应行
      res.status = xhr.status;
      res.statusText = xhr.statusText;

      // 响应头
      res.headers = Object.fromEntries(xhr.getAllResponseHeaders().trim().replaceAll('\r', '').split('\n').map(v => [decodeURIComponent(v.substring(0, v.indexOf(': ')).toLowerCase()), decodeURIComponent(v.substring(v.indexOf(': ') + 2))]));

      // 响应体
      if (req.responseType == 'text' && req.dataType == 'json') {
        res.body = (JSON.parse0 ?? JSON.parse)(xhr.responseText);
      } else if (req.responseType == 'text') {
        res.body = xhr.responseText;
      } else {
        res.body = xhr.response;
      }

      resolve();
    };

    // 发送请求
    if (req.method == 'POST' || req.method == 'PUT') {
      xhr.send(req.body);
    } else {
      xhr.send();
    }

    return promise;
  }
}

export {
  HttpQuickBase,
  HttpQuick,
};
