// ชื่อของแคชเวอร์ชัน
const cacheName = "summer-timetable-v1";

// รายการไฟล์ที่ต้องการแคชไว้เพื่อใช้งานแบบออฟไลน์
const assets = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Prompt&family=Itim&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js"
];

// เมื่อ service worker ติดตั้ง
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // ทำให้ service worker ใช้งานทันทีหลังติดตั้ง
});

// เมื่อมีการร้องขอ asset จากเบราว์เซอร์
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      // ถ้าเจอในแคชให้ใช้เลย ถ้าไม่เจอให้ไปโหลดจากเครือข่าย
      return res || fetch(event.request);
    })
  );
});
