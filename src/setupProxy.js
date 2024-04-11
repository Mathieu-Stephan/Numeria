const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = 'http://localhost:3001';

  app.use(
    '/api/data',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};
