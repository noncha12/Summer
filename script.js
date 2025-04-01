// ===================== ตัวแปรหลัก ===================== 
// อ้างอิง element ต่าง ๆ ที่ใช้ในระบบ
const body = document.body;
const canvas = document.getElementById("rain-canvas"); // canvas สำหรับฝนตก
const ctx = canvas.getContext("2d"); // context สำหรับวาด
const flood = document.getElementById("flood"); // กล่องน้ำท่วม
const sun = document.getElementById("sun"); // ดวงอาทิตย์
const lightning = document.getElementById("lightning"); // เอฟเฟกต์ฟ้าผ่า

let drops = [];                    // อาเรย์เก็บข้อมูลเม็ดฝนแต่ละเม็ด
let floodHeight = 0;              // ระดับน้ำ (vh)
let floodAlertShown = false;      // ตัวแปรตรวจสอบว่าแจ้งเตือนน้ำท่วมหรือยัง
let rainAnimationFrame = null;    // เก็บ id ของ requestAnimationFrame เพื่อควบคุมการวาดฝน

// ===================== ฝนตก =====================
// ฟังก์ชันเริ่มระบบฝน (สุ่มเม็ดฝนใหม่)
function initRain() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops = [];

  const dropCount = 300; // จำนวนเม็ดฝนทั้งหมด
  for (let i = 0; i < dropCount; i++) {
    const dir = Math.random() < 0.5 ? -1 : 1; // กำหนดทิศทางลม
    drops.push({
      x: Math.random() * canvas.width,           // ตำแหน่งแนวนอน
      y: Math.random() * canvas.height,          // ตำแหน่งแนวตั้ง
      length: Math.random() * 30 + 10,           // ความยาวฝน
      speed: Math.random() * 3 + 3,              // ความเร็วแนวดิ่ง
      xSpeed: dir * (Math.random() * 0.8 + 0.4)  // ความเร็วแนวนอน
    });
  }
}

// ฟังก์ชันวาดเม็ดฝนบน canvas
function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // ล้างหน้าจอ
  ctx.strokeStyle = "rgba(173,216,230,0.3)"; // สีเม็ดฝนโปร่งใส
  ctx.lineWidth = 1.1;

  drops.forEach(drop => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.xSpeed * 2, drop.y + drop.length);
    ctx.stroke();

    drop.x += drop.xSpeed;
    drop.y += drop.speed;

    // รีเซ็ตเม็ดฝนที่หลุดจอให้กลับมาเริ่มใหม่
    if (drop.y > canvas.height || drop.x < -20 || drop.x > canvas.width + 20) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  });

  // วาดเฉพาะตอนอยู่ใน Dark Mode เท่านั้น
  if (!body.classList.contains("light")) {
    rainAnimationFrame = requestAnimationFrame(drawRain);
  }
}

// เริ่มฝนตกถ้าเป็น Dark Mode
function startRainIfDarkMode() {
  cancelAnimationFrame(rainAnimationFrame); // หยุดฝนเดิมถ้ามี
  if (!body.classList.contains("light")) {
    canvas.style.display = "block";
    initRain();
    drawRain();
  } else {
    canvas.style.display = "none";
  }
}

// ===================== น้ำท่วม =====================
// ฟังก์ชันเพิ่มระดับน้ำเรื่อย ๆ
function increaseFlood() {
  if (!body.classList.contains("light") && floodHeight < 50) {
    floodHeight += 0.5; // เพิ่มทีละ 0.5 vh
    flood.style.height = floodHeight + "vh";

    // ถ้าน้ำเกิน 15vh และยังไม่ได้แจ้งเตือน ให้แสดง alert
    if (floodHeight >= 15 && !floodAlertShown) {
      document.getElementById("flood-alert").style.display = "block";
      floodAlertShown = true;
    }
  }
}
setInterval(increaseFlood, 1000); // เรียกทุกวินาที

// ===================== ดอกซากุระใน Light Mode =====================
// ฟังก์ชันสร้างกลีบดอกซากุระ (เฉพาะ Light Mode)
function createSakura() {
  if (!body.classList.contains("light")) return;

  const sakura = document.createElement("div");
  sakura.classList.add("sakura");
  sakura.textContent = "🌸";
  sakura.style.left = Math.random() * window.innerWidth + "px";
  sakura.style.fontSize = (Math.random() * 16 + 16) + "px";
  sakura.style.animationDuration = (Math.random() * 5 + 5) + "s";
  document.body.appendChild(sakura);

  // ลบซากุระหลังตกเสร็จ
  setTimeout(() => sakura.remove(), 10000);
}
setInterval(createSakura, 500); // สร้างทุก 0.5 วินาที

// ===================== ดวงอาทิตย์เคลื่อนที่ =====================
// ฟังก์ชันคำนวณตำแหน่งของดวงอาทิตย์ (เฉพาะ Light Mode)
function updateSunPosition() {
  if (!body.classList.contains("light")) return;

  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60; // ชั่วโมง + นาที
  const percent = Math.min(Math.max((hour - 6) / 12, 0), 1); // คิดเป็นเปอร์เซ็นต์ระหว่าง 6:00 - 18:00
  const sunX = percent * (window.innerWidth - 80); // คำนวณตำแหน่ง X ของดวงอาทิตย์
  sun.style.left = `${sunX}px`;
}
setInterval(updateSunPosition, 60000); // อัปเดตทุก 1 นาที
updateSunPosition(); // เรียกตอนโหลดหน้า

// ===================== นาฬิกา =====================
// ฟังก์ชันแสดงเวลาแบบเรียลไทม์
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const clock = document.getElementById("current-time");
  if (clock) clock.textContent = time;
}
setInterval(updateClock, 1000); // อัปเดตทุกวินาที
updateClock(); // แสดงทันทีตอนโหลด

// ===================== ปิดกล่องแจ้งเตือนน้ำท่วม =====================
// ใช้ปิดกล่อง alert แจ้งเตือนน้ำท่วม
function closeFloodAlert() {
  document.getElementById("flood-alert").style.display = "none";
}

// ===================== สลับโหมด Light/Dark =====================
// เมื่อสลับธีมจาก toggle switch
document.getElementById("toggle-theme-switch").addEventListener("change", () => {
  body.classList.toggle("light"); // สลับคลาส light
  startRainIfDarkMode();          // เริ่ม/หยุดฝน
  updateSunPosition();           // อัปเดตดวงอาทิตย์

  // รีเซ็ตน้ำกลับ 0
  floodHeight = 0;
  flood.style.height = "0vh";
  floodAlertShown = false;

  // ปิดแจ้งเตือน + ลบซากุระทั้งหมด
  document.getElementById("flood-alert").style.display = "none";
  document.querySelectorAll(".sakura").forEach(s => s.remove());
});

// ===================== ปุ่มเคลียร์ฝนแบบสมูท =====================
document.getElementById("clear-rain-btn").addEventListener("click", () => {
  // 1. ฝนยังตกอยู่ ไม่หยุด drawRain()
  // 2. ลบซากุระที่ตกอยู่
  document.querySelectorAll(".sakura").forEach(s => s.remove());

  // 3. เล่น animation ดูดน้ำกลับ
  const currentHeight = flood.offsetHeight;
  flood.style.setProperty("--initial-height", currentHeight + "px");
  flood.style.animation = "drainWater 1.5s ease forwards";

  // 4. รอให้ animation เสร็จแล้ว reset สถานะน้ำ
  setTimeout(() => {
    flood.style.height = "0vh";
    flood.style.animation = "";
    floodHeight = 0;
    floodAlertShown = false;
    document.getElementById("flood-alert").style.display = "none";

    // 5. รีเซ็ตเม็ดฝนใหม่
    if (!body.classList.contains("light")) {
      initRain();
    }
  }, 1600); // มากกว่าเวลาของ animation drainWater
});

// ===================== เอฟเฟกต์ฟ้าผ่า =====================
// ฟังก์ชันแสดงแสงฟ้าผ่า (เฉพาะ Dark Mode)
function flashLightning() {
  if (body.classList.contains("light")) return;
  lightning.style.animation = "lightningFlash 0.6s ease";
  setTimeout(() => lightning.style.animation = "", 600);
}

// ตั้งให้สุ่มฟ้าผ่าทุก ~7 วินาที (มีโอกาส 30% ที่จะเกิด)
setInterval(() => {
  if (!body.classList.contains("light") && Math.random() > 0.7) {
    flashLightning();
  }
}, 7000);

// ===================== เริ่มระบบ =====================
// เรียกตอนโหลดหน้า
startRainIfDarkMode();

// ปรับฝนและดวงอาทิตย์เมื่อปรับขนาดจอ
window.addEventListener("resize", () => {
  initRain();
  updateSunPosition();
});
