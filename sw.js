// sw.js
// ★ 版本號每次改動資產都要+1，確保使用者拿到新快取
const CACHE = 'pos-dos-blue-v15';

const ASSETS = [
  './',
  './index.html',
  './dos.css',
  './LanaPixel.woff2',
  './LanaPixel.ttf',
  './icon-192.png',
  './icon-512.png',
  './ding.wav',
  './enter.wav',       // Enter 一般音效
  './enterFinal.wav',  // 第三次 Enter 專用音效
  './S__67870744.png', // 感謝視窗圖片
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => {
      // 先回快取，沒有就走網路
      return (
        cached ||
        fetch(req).catch(() => {
          // 離線導覽時回 index.html（讓 PWA 單頁可運作）
          if (req.mode === 'navigate') return caches.match('./index.html');
        })
      );
    })
  );
});
