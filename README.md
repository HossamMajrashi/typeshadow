# TypeShadow ⌨️

<div align="center">

![TypeShadow](https://img.shields.io/badge/TypeShadow-v1.0-blue)
![Platform](https://img.shields.io/badge/Platform-Linux%20|%20Windows%20|%20macOS-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![RTL Support](https://img.shields.io/badge/RTL-Supported-orange)

**A powerful typing trainer with full RTL/LTR language support**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots) • [Credits](#-credits)

</div>

---

## 📖 About

TypeShadow is a modern typing training application designed with full support for **Right-to-Left (RTL)** and **Left-to-Right (LTR)** languages. Practice typing in Arabic, English, or any language with a clean, distraction-free interface.

## ✨ Features

### 🌐 **Multilingual Support**
- **RTL Languages**: Full support for Arabic, Hebrew, Persian, Urdu
- **LTR Languages**: English and all left-to-right languages
- **Seamless Switching**: Toggle between RTL/LTR with one click (⇆)
- **Complete Translation**: UI translates to Arabic when in RTL mode

### 📊 **Progress Tracking & Statistics**
- **Average WPM**: Track your average typing speed across all sessions
- **Best WPM**: See your highest typing speed achieved
- **Total Sessions**: Count of completed typing exercises
- **Average Accuracy**: Overall accuracy percentage
- **Session History**: View last 10 sessions with detailed stats (date, WPM, accuracy, errors)
- **Data Persistence**: Stores up to 50 sessions locally

### ⚙️ **Customization**
- **Adjustable Font Size**: 12px to 32px (A+/A- buttons)
- **Dark Mode**: Eye-friendly dark theme with smooth transitions
- **Timer Display**: Live timer in MM:SS format during practice
- **Sound Effects**: Optional timer tick sounds (🔊/🔇)
- **Text Overlay**: Toggle the shadow text overlay on/off

### 🎯 **Typing Features**
- **Real-time WPM**: Live words-per-minute calculation
- **Accuracy Tracking**: Instant feedback on typing accuracy
- **Mistake Counter**: Tracks errors during practice
- **Custom Text**: Practice with any text you want
- **Error Prevention**: Stops typing at mistakes for correction
- **Visual Feedback**: Color-coded correct/incorrect characters

### 🖥️ **User Experience**
- **Clean Interface**: Minimalist design for focused practice
- **Smooth Animations**: Polished transitions and effects
- **Keyboard Shortcuts**: Global shortcut (Ctrl+Shift+T / Cmd+Shift+T)
- **System Tray**: Minimize to tray option
- **Auto-launch**: Optional startup with system
- **Cross-platform**: Linux (Flatpak), Windows, macOS

## 📸 Screenshots

### English (LTR) Mode
![TypeShadow English](https://github.com/user-attachments/assets/e8b0826e-ece2-430e-afcb-a5542076c0d7)

### Arabic (RTL) Mode
![TypeShadow Arabic](https://github.com/user-attachments/assets/adcdc9f2-46ea-4208-bc7d-45d3ca15e6dc)

### Statistics Dashboard
![Statistics](https://github.com/user-attachments/assets/32e73eeb-da17-45bf-81d5-547e6850a8d7)

### Dark Mode
![Dark Mode](https://github.com/user-attachments/assets/caec2e8f-7317-48a4-b8d6-071c8f196b13)

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/typeshadow.git
   cd typeshadow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

### Building for Production

**Linux (appimage)**
```bash
npm run build:linux
```

**Linux (Flatpak)**
```bash
npm run build:flatpak
```

**Windows**
```bash
npm run build:win
```

**macOS**
```bash
npm run build:mac
```

## 📁 Project Structure

```
TypeShadow/
├── index.html          # Main HTML interface
├── renderer.js         # Application logic
├── main.js            # Electron main process
├── style.css          # Styling and themes
├── package.json       # Dependencies and scripts
├── Icons/             # Application icons
│   ├── 32x32.png
│   └── 256x256.png
└── sounds/            # Sound effects (optional)
    └── timer-ticks.mp3
```

## 🎮 Usage

### Basic Typing Practice

1. **Enter Text**: Type or paste the text you want to practice
2. **Configure**: 
   - Toggle text overlay (checkbox)
   - Adjust font size if needed (⚙️ → A+/A-)
   - Enable/disable timer sound (🔊/🔇)
3. **Start**: Click "Start Exercise" button
4. **Type**: Begin typing to match the displayed text
5. **Complete**: Finish the exercise to see your final stats

### Language Switching

- Click the **⇆** button to toggle between LTR (English) and RTL (Arabic)
- The entire UI will translate automatically
- Text direction changes for all text areas

### View Statistics

1. Click the **📊** icon in the header
2. View your progress:
   - Average WPM
   - Best WPM
   - Total sessions
   - Average accuracy
   - Recent session history

### Settings

1. Click the **⚙️** icon in the header
2. Adjust:
   - Font size (12px - 32px)
   - Timer sound effects (on/off)
   - Timer display visibility

### Keyboard Shortcuts

- **Global**: `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (macOS) - Open TypeShadow from anywhere
- **While Typing**: Backspace is disabled after mistakes - you must correct the error

## 🛠️ Technologies

- **Electron**: Cross-platform desktop framework
- **HTML5/CSS3**: Modern web technologies
- **JavaScript (ES6+)**: Application logic
- **LocalStorage**: Data persistence

## 🌟 Key Highlights

✅ **Perfect RTL Support**: Unlike most typing trainers, TypeShadow has native, flawless RTL support  
✅ **Bilingual UI**: Fully translated interface in Arabic and English  
✅ **Progress Tracking**: Comprehensive statistics to track improvement  
✅ **Customizable**: Font sizes, themes, sounds - make it yours  
✅ **Accurate WPM**: Industry-standard WPM calculation  
✅ **No Internet Required**: Works completely offline  
✅ **Open Source**: Free to use and modify  

## 📝 To-Do / Future Features

- [ ] Add more languages (Hebrew, Persian, Urdu)
- [ ] Import text from files
- [ ] Export statistics as CSV/PDF
- [ ] Typing games and challenges
- [ ] Custom keyboard layouts (DVORAK, COLEMAK)
- [ ] Achievement system with badges
- [ ] Cloud sync across devices
- [ ] Practice with code snippets
- [ ] Multiplayer typing races
- [ ] Voice-over support for accessibility

## 🐛 Known Issues

- Timer sound requires `sounds/timer-ticks.mp3` file (optional feature)
- Some browsers may block autoplay audio on first load

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Hossam Hassan Majrashi**

TypeShadow v1.0 | 2025

---

<div align="center">

**Made with ❤️ for bilingual typists**

[⭐ Star this repo](https://github.com/yourusername/typeshadow) • [🐛 Report Bug](https://github.com/yourusername/typeshadow/issues) • [💡 Request Feature](https://github.com/yourusername/typeshadow/issues)

</div>

---

## 🇸🇦 العربية

### حول التطبيق

TypeShadow هو تطبيق تدريب على الكتابة مصمم مع دعم كامل للغات من اليمين إلى اليسار (RTL) ومن اليسار إلى اليمين (LTR). تدرب على الكتابة بالعربية، الإنجليزية، أو أي لغة أخرى مع واجهة نظيفة وخالية من التشتيت.

### المميزات الرئيسية

- ✅ **دعم كامل للعربية**: واجهة مترجمة بالكامل مع تنسيق RTL مثالي
- ✅ **تتبع التقدم**: إحصائيات شاملة لتتبع تحسنك في الكتابة
- ✅ **قابل للتخصيص**: أحجام خطوط، سمات، أصوات - اجعله خاصاً بك
- ✅ **حساب WPM دقيق**: حساب سرعة الكتابة وفقاً للمعايير الصناعية
- ✅ **لا يتطلب إنترنت**: يعمل بشكل كامل دون اتصال بالإنترنت
- ✅ **مفتوح المصدر**: مجاني للاستخدام والتعديل

### التثبيت

```bash
git clone https://github.com/yourusername/typeshadow.git
cd typeshadow
npm install
npm start
```

### الاستخدام

1. **أدخل النص**: اكتب أو الصق النص الذي تريد التدرب عليه
2. **اضبط الإعدادات**: حجم الخط، الأصوات، الوضع المظلم
3. **ابدأ التمرين**: انقر على زر "ابدأ التمرين"
4. **اكتب**: ابدأ الكتابة لمطابقة النص المعروض
5. **شاهد الإحصائيات**: اطلع على سرعتك ودقتك بعد الانتهاء

---

**تم التطوير بواسطة حسام حسن مجرشي**
