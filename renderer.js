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

let startTime;
let mistakes = 0;
let totalTyped = 0;
let correctChars = 0;
let currentLang = "en";
let originalText = "";

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
    footer: "TypeShadow v1.0 | By Hossam Hassan Majrashi",
    alertEmpty: "Please enter some text first!",
    alertComplete: "🎉 Well done! Exercise completed.\n\nFinal Speed: {wpm} WPM\nAccuracy: {accuracy}%"
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
    alertComplete: "🎉 أحسنت! اكتمل التمرين.\n\nالسرعة النهائية: {wpm} كلمة/دقيقة\nالدقة: {accuracy}%"
  }
};

// Translate all elements
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

// Get translated text
function t(key, replacements = {}) {
  let text = translations[currentLang][key] || translations.en[key] || key;
  Object.keys(replacements).forEach((placeholder) => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  return text;
}

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.querySelector(".theme-icon").textContent = "☀️";
}

// RTL/LTR direction toggle
dirToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const currentDir = html.getAttribute("dir");
  const newDir = currentDir === "rtl" ? "ltr" : "rtl";

  currentLang = newDir === "rtl" ? "ar" : "en";
  html.setAttribute("dir", newDir);
  html.setAttribute("lang", currentLang);

  dirToggle.querySelector(".dir-label").textContent = newDir.toUpperCase();
  localStorage.setItem("direction", newDir);
  localStorage.setItem("language", currentLang);

  translatePage();

  customText.setAttribute("dir", newDir);
  typingInput.setAttribute("dir", newDir);
  typingText.setAttribute("dir", newDir);
});

// Load saved preferences
const savedDir = localStorage.getItem("direction") || "ltr";
const savedLang = localStorage.getItem("language") || "en";
currentLang = savedLang;

if (savedDir === "rtl") {
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", "ar");
  dirToggle.querySelector(".dir-label").textContent = "RTL";
  customText.setAttribute("dir", "rtl");
  translatePage();
}

// Start exercise
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
});

// FIXED: Typing input - prevent text shifting in Arabic
typingInput.addEventListener("input", () => {
  let typed = typingInput.value;
  totalTyped = typed.length;

  let mistakeFound = false;
  correctChars = 0;

  // Build the overlay HTML WITHOUT modifying the DOM structure
  let overlayHTML = "";

  for (let i = 0; i < originalText.length; i++) {
    if (i < typed.length) {
      if (typed[i] === originalText[i] && !mistakeFound) {
        // Correct character - wrap in span to maintain structure
        overlayHTML += `<span class="correct">${originalText[i]}</span>`;
        correctChars++;
      } else {
        // First mistake found
        if (!mistakeFound) {
          mistakeFound = true;
          mistakes++;
          typingInput.value = typed.slice(0, i + 1); // Stop at mistake
          typed = typingInput.value;
        }
        overlayHTML += `<span class="mistake">${originalText[i]}</span>`;
      }
    } else {
      // Not yet typed - keep original character visible
      overlayHTML += originalText[i];
    }
  }

  // Update overlay ONCE to prevent shifting
  typingText.innerHTML = overlayHTML;

  // Visual feedback
  if (mistakeFound) {
    typingInput.style.border = "2px solid #e74c3c";
  } else {
    typingInput.style.border = "2px solid #4a90e2";
  }

  // Calculate WPM
  const currentTime = new Date();
  const timeElapsed = (currentTime - startTime) / 60000;

  const grossWPM = timeElapsed > 0 ? Math.round((totalTyped / 5) / timeElapsed) : 0;
  const errorRate = timeElapsed > 0 ? mistakes / timeElapsed : 0;
  const netWPM = Math.max(0, Math.round(grossWPM - errorRate));

  wpmDisplay.textContent = netWPM;
  mistakesDisplay.textContent = mistakes;

  const accuracy = totalTyped === 0 ? 100 : Math.max(0, Math.round((correctChars / totalTyped) * 100));
  accuracyDisplay.textContent = accuracy + "%";

  // Finished
  if (typed === originalText && !mistakeFound) {
    const endTime = new Date();
    const minutes = (endTime - startTime) / 60000;
    const finalWPM = Math.round((originalText.length / 5) / minutes);
    wpmDisplay.textContent = finalWPM;
    typingInput.disabled = true;
    alert(t("alertComplete", { wpm: finalWPM, accuracy: accuracy }));
  }
});