const startBtn = document.getElementById("start-btn");
const customText = document.getElementById("custom-text");
const trainingSection = document.getElementById("training-section");
const typingText = document.getElementById("typing-text");
const typingInput = document.getElementById("typing-input");
const overlayToggle = document.getElementById("overlayToggle");
const wpmDisplay = document.getElementById("wpm");
const mistakesDisplay = document.getElementById("mistakes");
const accuracyDisplay = document.getElementById("accuracy");
const themeToggle = document.getElementById("theme-toggle");
const dirToggle = document.getElementById("dir-toggle");
const soundToggle = document.getElementById("sound-toggle");

// New UI elements
const statsToggle = document.getElementById("stats-toggle");
const settingsToggle = document.getElementById("settings-toggle");
const statsPanel = document.getElementById("stats-panel");
const settingsPanel = document.getElementById("settings-panel");
const timerDisplay = document.getElementById("timer-display");
const fontIncrease = document.getElementById("font-increase");
const fontDecrease = document.getElementById("font-decrease");
const fontSizeDisplay = document.getElementById("font-size-display");
const clearStatsBtn = document.getElementById("clear-stats");
const soundEffectsCheckbox = document.getElementById("sound-effects");

let startTime;
let mistakes = 0;
let totalTyped = 0;
let correctChars = 0;
let currentLang = "en";
let originalText = "";
let timerInterval;
let currentFontSize = 16;
let soundEnabled = true; // Always start with sound enabled

// Audio for timer ticks
let timerTickSound = null;
try {
  timerTickSound = new Audio('sounds/timer-ticks.mp3');
  timerTickSound.volume = 0.3;
  timerTickSound.loop = false;
} catch (e) {
  console.log('Timer sound file not found - continuing without sound');
}

// LocalStorage keys
const STORAGE_KEYS = {
  SESSIONS: "typeshadow_sessions",
  FONT_SIZE: "typeshadow_font_size",
  THEME: "theme",
  DIRECTION: "direction",
  LANGUAGE: "language"
  // Removed SOUND_ENABLED - always start with sound on
};

// Translation dictionary
const translations = {
  en: {
    subtitle: "Learn typing by writing over the text",
    enterText: "✍️ Enter your text:",
    textPlaceholder: "Type or paste the text you want to practice...",
    showOverlay: "Show text overlay while typing",
    startBtn: "Start Exercise",
    typeBelow: "🎯 Type the text below:",
    wpm: "WPM",
    mistakes: "Mistakes",
    accuracy: "Accuracy",
    footer: "TypeShadow v1.0 | BY Hossam Hassan Majrashi",
    alertEmpty: "Please enter some text first!",
    alertComplete: "🎉 Well done! Exercise completed.\n\nFinal Speed: {wpm} WPM\nAccuracy: {accuracy}%",
    statsTitle: "Typing Statistics",
    clearStats: "Clear History",
    avgWPM: "Average WPM",
    bestWPM: "Best WPM",
    totalSessions: "Total Sessions",
    avgAccuracy: "Average Accuracy",
    recentSessions: "Recent Sessions",
    noHistory: "No typing sessions yet. Start practicing!",
    settingsTitle: "Settings",
    fontSize: "Font Size",
    soundEffects: "Timer Sound Effects",
    showTimer: "Show Timer"
  },
  ar: {
    subtitle: "تعلم الكتابة بالكتابة فوق النص",
    enterText: "✍️ أدخل النص الخاص بك:",
    textPlaceholder: "اكتب أو الصق النص الذي تريد التدرب عليه...",
    showOverlay: "إظهار تراكب النص أثناء الكتابة",
    startBtn: "ابدأ التمرين",
    typeBelow: "🎯 اكتب النص أدناه:",
    wpm: "كلمة/دقيقة",
    mistakes: "الأخطاء",
    accuracy: "الدقة",
    footer: "TypeShadow الإصدار 1.0 | بواسطة حسام حسن مجرشي",
    alertEmpty: "الرجاء إدخال بعض النص أولاً!",
    alertComplete: "🎉 أحسنت! اكتمل التمرين.\n\nالسرعة النهائية: {wpm} كلمة/دقيقة\nالدقة: {accuracy}%",
    statsTitle: "إحصائيات الكتابة",
    clearStats: "مسح السجل",
    avgWPM: "متوسط السرعة",
    bestWPM: "أفضل سرعة",
    totalSessions: "إجمالي الجلسات",
    avgAccuracy: "متوسط الدقة",
    recentSessions: "الجلسات الأخيرة",
    noHistory: "لا توجد جلسات كتابة بعد. ابدأ التدريب!",
    settingsTitle: "الإعدادات",
    fontSize: "حجم الخط",
    soundEffects: "مؤثرات صوت المؤقت",
    showTimer: "إظهار المؤقت"
  }
};

// Translate page
function translatePage() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (translations[currentLang][key]) {
      element.placeholder = translations[currentLang][key];
    }
  });
}

function t(key, replacements = {}) {
  let text = translations[currentLang][key] || translations.en[key] || key;
  Object.keys(replacements).forEach((placeholder) => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  return text;
}

// Sound toggle functionality (does NOT save state)
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  const icon = soundEnabled ? "🔊" : "🔇";
  soundToggle.querySelector(".sound-icon").textContent = icon;
  soundEffectsCheckbox.checked = soundEnabled;
  // Removed localStorage save - mute is temporary per session

  // Stop sound immediately when muted
  if (!soundEnabled && timerTickSound) {
    timerTickSound.pause();
    timerTickSound.currentTime = 0;
  }
});

// Sync checkbox with button
soundEffectsCheckbox.addEventListener("change", () => {
  soundEnabled = soundEffectsCheckbox.checked;
  const icon = soundEnabled ? "🔊" : "🔇";
  soundToggle.querySelector(".sound-icon").textContent = icon;
  // Removed localStorage save - mute is temporary per session

  // Stop sound immediately when muted via checkbox
  if (!soundEnabled && timerTickSound) {
    timerTickSound.pause();
    timerTickSound.currentTime = 0;
  }
});

// Always start with sound enabled - no saved state
soundEnabled = true;
soundToggle.querySelector(".sound-icon").textContent = "🔊";
soundEffectsCheckbox.checked = true;

// Statistics Management
function saveSession(wpm, accuracy, mistakes, duration) {
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || "[]");
  sessions.unshift({
    date: new Date().toISOString(),
    wpm: wpm,
    accuracy: accuracy,
    mistakes: mistakes,
    duration: duration
  });

  if (sessions.length > 50) {
    sessions.pop();
  }

  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || "[]");

  if (sessions.length === 0) {
    document.getElementById("avg-wpm").textContent = "0";
    document.getElementById("best-wpm").textContent = "0";
    document.getElementById("total-sessions").textContent = "0";
    document.getElementById("avg-accuracy").textContent = "0%";
    return;
  }

  const totalWPM = sessions.reduce((sum, s) => sum + s.wpm, 0);
  const avgWPM = Math.round(totalWPM / sessions.length);
  const bestWPM = Math.max(...sessions.map(s => s.wpm));
  const totalAcc = sessions.reduce((sum, s) => sum + s.accuracy, 0);
  const avgAcc = Math.round(totalAcc / sessions.length);

  document.getElementById("avg-wpm").textContent = avgWPM;
  document.getElementById("best-wpm").textContent = bestWPM;
  document.getElementById("total-sessions").textContent = sessions.length;
  document.getElementById("avg-accuracy").textContent = avgAcc + "%";

  const historyContainer = document.getElementById("session-history");
  if (sessions.length > 0) {
    historyContainer.innerHTML = sessions.slice(0, 10).map((session) => {
      const date = new Date(session.date);
      const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
      return `
        <div class="session-item">
          <span class="session-date">${dateStr}</span>
          <span class="session-wpm">${session.wpm} WPM</span>
          <span class="session-acc">${session.accuracy}%</span>
          <span class="session-mistakes">${session.mistakes} errors</span>
        </div>
      `;
    }).join("");
  } else {
    historyContainer.innerHTML = `<p class="no-data">${t("noHistory")}</p>`;
  }
}

clearStatsBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all typing history?")) {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    updateStatsDisplay();
  }
});

statsToggle.addEventListener("click", () => {
  statsPanel.classList.toggle("hidden");
  settingsPanel.classList.add("hidden");
  updateStatsDisplay();
});

settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
  statsPanel.classList.add("hidden");
});

// Font size controls
function setFontSize(size) {
  currentFontSize = Math.max(12, Math.min(32, size));
  document.documentElement.style.setProperty('--custom-font-size', currentFontSize + 'px');
  fontSizeDisplay.textContent = currentFontSize + 'px';
  localStorage.setItem(STORAGE_KEYS.FONT_SIZE, currentFontSize);
}

fontIncrease.addEventListener("click", () => {
  setFontSize(currentFontSize + 2);
});

fontDecrease.addEventListener("click", () => {
  setFontSize(currentFontSize - 2);
});

const savedFontSize = parseInt(localStorage.getItem(STORAGE_KEYS.FONT_SIZE)) || 16;
setFontSize(savedFontSize);

// Timer with proper sound control
function startTimer() {
  let seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    // Play tick sound ONLY if enabled and sound file exists
    if (soundEnabled && timerTickSound) {
      timerTickSound.currentTime = 0;
      timerTickSound.play().catch(err => {
        console.log('Sound playback prevented:', err);
      });
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (timerTickSound) {
    timerTickSound.pause();
    timerTickSound.currentTime = 0;
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem(STORAGE_KEYS.THEME, isDark ? "dark" : "light");
});

if (localStorage.getItem(STORAGE_KEYS.THEME) === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.querySelector(".theme-icon").textContent = "☀️";
}

dirToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const currentDir = html.getAttribute("dir");
  const newDir = currentDir === "rtl" ? "ltr" : "rtl";

  currentLang = newDir === "rtl" ? "ar" : "en";
  html.setAttribute("dir", newDir);
  html.setAttribute("lang", currentLang);

  dirToggle.querySelector(".dir-label").textContent = newDir.toUpperCase();
  localStorage.setItem(STORAGE_KEYS.DIRECTION, newDir);
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLang);

  translatePage();

  customText.setAttribute("dir", newDir);
  typingInput.setAttribute("dir", newDir);
  typingText.setAttribute("dir", newDir);
});

const savedDir = localStorage.getItem(STORAGE_KEYS.DIRECTION) || "ltr";
const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en";
currentLang = savedLang;

if (savedDir === "rtl") {
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", "ar");
  dirToggle.querySelector(".dir-label").textContent = "RTL";
  customText.setAttribute("dir", "rtl");
  translatePage();
}

startBtn.addEventListener("click", () => {
  const text = customText.value.trim();
  if (!text) return alert(t("alertEmpty"));

  originalText = text;
  trainingSection.classList.remove("hidden");
  typingText.textContent = originalText;
  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.focus();

  const currentDir = document.documentElement.getAttribute("dir");
  typingInput.setAttribute("dir", currentDir);
  typingText.setAttribute("dir", currentDir);

  mistakes = 0;
  totalTyped = 0;
  correctChars = 0;
  wpmDisplay.textContent = 0;
  mistakesDisplay.textContent = 0;
  accuracyDisplay.textContent = "100%";

  typingText.style.display = overlayToggle.checked ? "block" : "none";
  startTime = new Date();
  startTimer();
});

typingInput.addEventListener("input", () => {
  let typed = typingInput.value;
  totalTyped = typed.length;

  let mistakeFound = false;
  correctChars = 0;
  let overlayHTML = "";

  for (let i = 0; i < originalText.length; i++) {
    if (i < typed.length) {
      if (typed[i] === originalText[i] && !mistakeFound) {
        overlayHTML += `<span class="correct">${originalText[i]}</span>`;
        correctChars++;
      } else {
        if (!mistakeFound) {
          mistakeFound = true;
          mistakes++;
          typingInput.value = typed.slice(0, i + 1);
          typed = typingInput.value;
        }
        overlayHTML += `<span class="mistake">${originalText[i]}</span>`;
      }
    } else {
      overlayHTML += originalText[i];
    }
  }

  typingText.innerHTML = overlayHTML;

  if (mistakeFound) {
    typingInput.style.border = "2px solid #e74c3c";
  } else {
    typingInput.style.border = "2px solid #4a90e2";
  }

  const currentTime = new Date();
  const timeElapsed = (currentTime - startTime) / 60000;

  const grossWPM = timeElapsed > 0 ? Math.round((totalTyped / 5) / timeElapsed) : 0;
  const errorRate = timeElapsed > 0 ? mistakes / timeElapsed : 0;
  const netWPM = Math.max(0, Math.round(grossWPM - errorRate));

  wpmDisplay.textContent = netWPM;
  mistakesDisplay.textContent = mistakes;

  const accuracy = totalTyped === 0 ? 100 : Math.max(0, Math.round((correctChars / totalTyped) * 100));
  accuracyDisplay.textContent = accuracy + "%";

  if (typed === originalText && !mistakeFound) {
    const endTime = new Date();
    const minutes = (endTime - startTime) / 60000;
    const finalWPM = Math.round((originalText.length / 5) / minutes);
    const duration = Math.round((endTime - startTime) / 1000);

    wpmDisplay.textContent = finalWPM;
    typingInput.disabled = true;
    stopTimer();

    saveSession(finalWPM, accuracy, mistakes, duration);

    alert(t("alertComplete", { wpm: finalWPM, accuracy: accuracy }));
  }
});

updateStatsDisplay();
