const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.petzoa.site', 
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '', 
      },
    })
  );
};
