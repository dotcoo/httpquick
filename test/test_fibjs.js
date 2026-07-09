// Copyright 2021 The dotcoo <dotcoo@163.com>. All rights reserved.

'use strict';

// const { HttpQuick } = require('../dist/fibjs.cjs');
const { HttpQuick } = require('./HttpQuickFibjs');

// == http对象 ==
const httpQuick = new HttpQuick({
  baseUrl: '/api',
  timeout: 60000,
});

// == 中间件 ==

// loading
httpQuick.addMiddleware(async function(req, res, next = null) {
  console.log(req.url);
  await next(req, res);
});

// == 全局函数 ==
httpQuick.globalMethods();

// const res = httpGet({ url: 'http://127.0.0.1:8888/test/base1/index', });
const res = httpGet({ url: 'http://127.0.0.1:8888/test/base1/big', });
console.log('res', res);
