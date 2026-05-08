import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Fly.io 내부 네트워크 주소를 사용하여 백엔드로 요청을 전달합니다.
const BACKEND_URL = process.env.INTERNAL_API_SERVER_URL;
console.log(BACKEND_URL);

// /api 로 시작하는 모든 요청을 백엔드로 프록시 (http-proxy-middleware v3 syntax)
app.use(
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathFilter: '/api',
    // Ensure cookies from proxied responses are accepted by browser on frontend origin.
    cookieDomainRewrite: '',
    cookiePathRewrite: '/',
  }),
);

// 정적 파일 서빙 (React build 폴더)
app.use(express.static(path.join(__dirname, 'build')));

// 모든 경로를 index.html로 리다이렉트 (SPA 지원)
app.get('*any', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express ESM Reverse Proxy server is running on port ${PORT}`);
  console.log(`Proxying /api to ${BACKEND_URL}`);
});
