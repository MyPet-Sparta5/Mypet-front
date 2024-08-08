const { createProxyMiddleware } = require('http-proxy-middleware');
const baseURL = process.env.REACT_APP_API_BASE_URL;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: baseURL,
      changeOrigin: true,
    })
  );
};