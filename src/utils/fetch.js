import { HttpQuick } from '../../lib/httpquick-fetch';

const createHttpQuick = () => {
  return {
    install: (app, { store = null, router = null }) => {
      // == http对象 ==
      const httpQuick = new HttpQuick({
        baseUrl: '/src/api',
        timeout: 60000,
      });

      // == 依赖注入 ==
      httpQuick.store = store;
      httpQuick.router = router;

      // == 中间件 ==

      // loading
      httpQuick.addMiddleware(async function(req, res, next = null) {
        console.log(req.url);
        await next(req, res);
      });

      // == 注册 ==
      app.provide('httpQuickFetch', httpQuick);
    },
  };
};
