// ===================== ตัวแปรหลัก =====================
const body = document.body;
const canvas = document.getElementById("rain-canvas");
const ctx = canvas.getContext("2d");
const flood = document.getElementById("flood");
const sun = document.getElementById("sun");
let drops = []; // เก็บเม็ดฝน
let floodHeight = 0; // ระดับน้ำ (vh)
let floodAlertShown = false; // กันไม่ให้แจ้งเตือนซ้ำ

// ===================== ฝนตก (Dark Mode เท่านั้น) =====================
function initRain() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops = [];

  for (let i = 0; i < 100; i++) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 1.2 + 0.8,
      xSpeed: dir * (Math.random() * 0.5 + 0.2)
    });
  }
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(173,216,230,0.3)";
  ctx.lineWidth = 1.1;

  drops.forEach(drop => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.xSpeed * 2, drop.y + drop.length);
    ctx.stroke();

    drop.x += drop.xSpeed;
    drop.y += drop.speed;

    if (drop.y > canvas.height || drop.x < -20 || drop.x > canvas.width + 20) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  });

  if (!body.classList.contains("light")) {
    requestAnimationFrame(drawRain);
  }
}

function startRainIfDarkMode() {
  if (!body.classList.contains("light")) {
    canvas.style.display = "block";
    initRain();
    drawRain();
  } else {
    canvas.style.display = "none";
  }
}

// ===================== น้ำท่วมขณะฝนตก =====================
function increaseFlood() {
  if (!body.classList.contains("light")) {
    if (floodHeight < 50) {
      floodHeight += 0.3;
      flood.style.height = floodHeight + "vh";

      // แจ้งเตือนเมื่อระดับน้ำเกิน 30vh
      if (floodHeight >= 30 && !floodAlertShown) {
        document.getElementById("flood-alert").style.display = "block";
        floodAlertShown = true;
      }
    }
  }
}
setInterval(increaseFlood, 1000); // ทุกวินาที

// ===================== ดอกซากุระ (เฉพาะ Light Mode) =====================
function createSakura() {
  if (!body.classList.contains("light")) return;

  const sakura = document.createElement("div");
  sakura.classList.add("sakura");
  sakura.textContent = "🌸";
  sakura.style.left = Math.random() * window.innerWidth + "px";
  sakura.style.fontSize = (Math.random() * 16 + 16) + "px";
  sakura.style.animationDuration = (Math.random() * 5 + 5) + "s";

  document.body.appendChild(sakura);

  setTimeout(() => {
    sakura.remove();
  }, 10000); // ลบทิ้งหลังตก
}
setInterval(createSakura, 100); // ดอกใหม่ทุก 0.1 วิ

// ===================== ดวงอาทิตย์เคลื่อนตามเวลา =====================
function updateSunPosition() {
  if (!body.classList.contains("light")) return;

  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const percent = Math.min(Math.max((hour - 6) / 12, 0), 1);
  const sunX = percent * (window.innerWidth - 80);
  sun.style.left = `${sunX}px`;
}
setInterval(updateSunPosition, 60000);
updateSunPosition();

// ===================== นาฬิกาเวลาปัจจุบัน =====================
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const clock = document.getElementById("current-time");
  if (clock) clock.textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

// ===================== ปิดแจ้งเตือนน้ำท่วม =====================
function closeFloodAlert() {
  document.getElementById("flood-alert").style.display = "none";
}

// ===================== Toggle ธีม Light / Dark =====================
document.getElementById("toggle-theme-switch").addEventListener("change", () => {
  body.classList.toggle("light");
  startRainIfDarkMode();
  updateSunPosition();

  // รีเซ็ตน้ำ
  floodHeight = 0;
  flood.style.height = "0vh";

  // รีเซ็ตแจ้งเตือน
  floodAlertShown = false;
  document.getElementById("flood-alert").style.display = "none";

  // ลบซากุระทั้งหมด
  document.querySelectorAll(".sakura").forEach(s => s.remove());
});

// ===================== ปุ่มเคลียร์ฝน =====================
document.getElementById("clear-rain-btn").addEventListener("click", () => {
  drops = [];
  document.querySelectorAll(".sakura").forEach(s => s.remove());

  // น้ำถูกดูดลง
  const currentHeight = flood.offsetHeight;
  flood.style.setProperty("--initial-height", currentHeight + "px");
  flood.style.animation = "drainWater 1.5s ease forwards";

  setTimeout(() => {
    flood.style.height = "0vh";
    flood.style.animation = "";
    floodHeight = 0;
    floodAlertShown = false;
    document.getElementById("flood-alert").style.display = "none";
  }, 1500);
});

// ===================== เริ่มต้นเมื่อโหลดหน้า =====================
startRainIfDarkMode();
window.addEventListener("resize", () => {
  initRain();
  updateSunPosition();
});
