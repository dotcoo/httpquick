import { HttpQuickAjax } from '../lib/HttpQuickAjax';

// == http对象 ==

export const httpQuick = new HttpQuickAjax({
  baseUrl: config.apiBaseUrl,
  timeout: config.timeout,
});

// == 中间件 ==

// loading
httpQuick.addMiddleware(async function(req, res, next = null) {
  if (!('loading' in req)) { return await next(req, res); }
  req.loading.value = true;
  await next(req, res);
  req.loading.value = false;
});

// 响应结构调整
httpQuick.addMiddleware(async function(req, res, next = null) {
  await next(req, res);
  if (req.responseType == 'text' && req.dataType == 'json' && res.body != null && typeof res.body == 'object') {
    res.parent = { ...res };
    for (const key in res) { delete res[key]; }
    for (const key in res.parent.body) { res[key] = res.parent.body[key]; }
  }
});

// 请求前缀
export const prefixs = {
  '~prefix/': '/xxxx/xxxx/prefix/',
};

// 请求前缀
httpQuick.addMiddleware(async function(req, res, next = null) {
  if (!req.url.startsWith('~')) { return await next(req, res); }
  for (let us = req.url.split('/'), i = 0; i < us.length; i++) {
    const prefix = us.slice(0, i+1).join('/')+'/';
    if (!(prefix in prefixs)) { continue; }
    req.url = prefixs[prefix] + req.url.substring(prefix.length);
  }
  await next(req, res);
});

// 添加访问 TOKEN Terminal Device
httpQuick.addMiddleware(async function(req, res, next = null) {
  if (!this.store || req.injectToken === false || !(req.url.startsWith('/') || req.injectToken === true)) { return await next(req, res); }
  const accessToken = this.store.token.accessToken;
  if (!req.headers.Authorization && accessToken) {
    req.headers.Authorization = 'Bearer ' + accessToken;
  }
  // req.headers.Terminal = this.store.state.settings.terminal;
  // req.headers.Device = this.store.state.settings.device;
  await next(req, res);
});

// 请求缓存
httpQuick.addMiddleware(async function(req, res, next = null) {
  if (!req.cache) { return await next(req, res); }
  req.cache.httpCaches = req.cache?.httpCaches || {};
  req.cacheKey = req.cacheKey || `${req.method}${req.url}${JSON.stringify(req.headers)}${JSON.stringify(req.query)}${JSON.stringify(req.json)}${JSON.stringify(req.body)}`;
  if (req.cacheKey in req.cache.httpCaches) { return Object.assign(res, JSON.parse(req.cache.httpCaches[req.cacheKey])); }
  await next(req, res);
  req.cache.httpCaches[req.cacheKey] = JSON.stringify({ status: res.status, statusText: res.statusText, headers: res.headers, body: res.body });
});

// 未登录
httpQuick.addMiddleware(async function(req, res, next = null) {
  await next(req, res);
  if (!this.router || !this.store) { return; }
  if (res.body.errno !== 2) { return; }
  this.store.clear?.();
  if (this.platform) {
    this.platform?.redirectto({ url: '/pages/account/login?redirectTo=' + encodeURIComponent(req.fromUrl ?? '') });
  } else {
    this.router?.replace({ path: '/account/login', query: { redirect: encodeURIComponent(this.router.currentRoute.value.fullPath ?? '') } });
  }
});

// 响应重写
httpQuick.addMiddleware(async function(req, res, next = null) {
  await next(req, res);
  if (req.responseType == 'text' && req.dataType == 'json' && res.body != null && typeof res.body == 'object') {
    res.body.errno = res.body?.errno ?? {200:0,401:2}[res.body?.code] ?? res.body?.code ?? 1;
    res.body.errmsg = res.body?.errmsg ?? res.body?.msg ?? '';
  }
});

// == 快捷方法 ==
globalThis.httpQuick = httpQuick;
globalThis.httpGet = httpQuick.get.bind(httpQuick);
globalThis.httpPost = httpQuick.post.bind(httpQuick);
globalThis.httpPut = httpQuick.put.bind(httpQuick);
globalThis.httpDelete = httpQuick.del.bind(httpQuick);
// globalThis.httpUpload = httpQuick.upload.bind(httpQuick);
// globalThis.httpDownload = httpQuick.download.bind(httpQuick);

export default httpQuick;
