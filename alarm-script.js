let alarmTime = null;
let alarmTimeout = null;
let countdownInterval = null;

const audio = document.getElementById('alarm-audio');
const stopButton = document.getElementById('stop-button');
const statusText = document.getElementById('alarm-status');
const countdownText = document.getElementById('countdown');

// ⏰ แสดงเวลาปัจจุบันแบบเรียลไทม์
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('current-time').textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

function setAlarm() {
  const input = document.getElementById('alarm-time');
  const timeValue = input.value;

  if (!timeValue) {
    alert("กรุณาเลือกเวลาปลุก");
    return;
  }

  const now = new Date();
  const [hours, minutes] = timeValue.split(":");
  const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

  if (alarmDate <= now) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }

  const timeToAlarm = alarmDate - now;
  alarmTime = alarmDate;

  statusText.textContent = `ตั้งปลุกไว้ที่ ${timeValue}`;
  stopButton.style.display = "none";

  if (alarmTimeout) clearTimeout(alarmTimeout);
  alarmTimeout = setTimeout(triggerAlarm, timeToAlarm);

  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => updateCountdown(alarmDate), 1000);
  updateCountdown(alarmDate);
}

function updateCountdown(alarmDate) {
  const now = new Date();
  const diff = alarmDate - now;

  if (diff <= 0) {
    countdownText.textContent = `ถึงเวลาแล้ว!`;
    clearInterval(countdownInterval);
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  countdownText.textContent = `เหลือเวลา: ${hours} ชม. ${minutes} นาที ${seconds} วินาที`;
}

function triggerAlarm() {
  audio.play();
  stopButton.style.display = "inline-block";
  statusText.textContent = "⏰ ปลุกแล้ว!";

  if ("vibrate" in navigator) {
    navigator.vibrate([500, 300, 500, 300, 500]);
  }

  clearInterval(countdownInterval);
}

function stopAlarm() {
  audio.pause();
  audio.currentTime = 0;
  stopButton.style.display = "none";
  statusText.textContent = "⏹️ ปิดปลุกแล้ว";
  countdownText.textContent = "-";
}
