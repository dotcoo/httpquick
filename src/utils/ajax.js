import { HttpquickAjax } from '../../lib/HttpquickAjax';

export const createHttpquick = () => {
  return {
    install: (app, options) => {
      // == http对象 ==
      const httpquick = new HttpquickAjax({
        baseUrl: '/api',
        timeout: 60000,
      });

      // == 依赖注入 ==
      app.config.globalProperties.$http = httpquick;
      for (const key in options) {
        httpquick[key] = options[key];
      }

      // == 中间件 ==

      // loading
      httpquick.addMiddleware(async function(req, res, next = null) {
        console.log(req.url);
        await next(req, res);
      });

      // == 注册 ==
      app.provide('httpquickajax', httpquick);

      // == 全局函数 ==
      httpquick.globalMethods();
    },
  };
};
