import { HttpQuickAjax } from '../../lib/HttpQuickAjax';

export const createHttpQuick = () => {
  return {
    install: (app, options) => {
      // == http对象 ==
      const httpQuick = new HttpQuickAjax({
        baseUrl: '/api',
        timeout: 60000,
      });

      // == 依赖注入 ==
      app.config.globalProperties.$http = httpQuick;
      for (const key in options) {
        httpQuick[key] = options[key];
      }

      // == 中间件 ==

      // loading
      httpQuick.addMiddleware(async function(req, res, next = null) {
        console.log(req.url);
        await next(req, res);
      });

      // == 注册 ==
      app.provide('httpQuickAjax', httpQuick);

      // == 全局函数 ==
      httpQuick.globalMethods();
    },
  };
};
