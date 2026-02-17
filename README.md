# 🎵 PitchCraft

**An open-source, accessible chromatic tuner for the web.**

PitchCraft is a modern, browser-based instrument tuner built with React. It supports 8 instruments with real-time pitch detection, reference tone playback, and inclusive accessibility features — all running entirely in your browser with zero backend required.

---

## ✨ Features

### 🎼 Multi-Instrument Support
Each instrument includes a custom SVG illustration and standard tuning reference:

| Instrument | Tuning | Strings |
|------------|--------|---------|
| 🎸 Guitar | E A D G B E | 6 |
| 🎸 Bass | E A D G | 4 |
| 🪕 Ukulele | G C E A | 4 |
| 🎻 Violin | G D A E | 4 |
| 🎻 Cello | C G D A | 4 |
| 🪕 Banjo | G D G B D (Open G) | 5 |
| 🪕 Mandolin | G D A E | 4 |
| 🎵 Chromatic | All notes | Any |

### 🎯 Real-Time Pitch Detection
- Autocorrelation-based frequency detection via the Web Audio API
- Visual cents meter with color-coded feedback (green / yellow / red)
- Live volume indicator showing microphone input level
- Frequency display in Hz with note name and octave

### 🔊 Reference Tone Playback
- Tap any string button to hear the correct pitch
- Adjustable A4 reference frequency: 432 Hz, 435 Hz, 438 Hz, 440 Hz, 442 Hz, 444 Hz

### ♿ Accessibility
- **High Contrast Mode** — increased contrast for low-vision users
- **Reduced Motion Mode** — disables animations for vestibular sensitivity
- **Large Text Mode** — scales all text up 25%
- **Full keyboard navigation** — every control is tab-accessible
- **Screen reader support** — ARIA roles, labels, and live regions throughout
- **Semantic HTML** — proper headings, landmarks, and structure

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/indjoov/pitchcraft.git
cd pitchcraft

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 🏗️ Project Structure

```
pitchcraft/
├── public/              # Static assets
├── src/
│   ├── App.jsx          # Root component
│   ├── tuner.jsx        # Main tuner component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── LICENSE              # MIT License
├── CONTRIBUTING.md      # Contribution guidelines
└── README.md
```

---

## 🛠️ Tech Stack

- **React** — UI framework
- **Vite** — Build tool and dev server
- **Web Audio API** — Microphone input and pitch detection
- **Tailwind CSS** (optional) — Utility styling
- **No external tuning libraries** — all pitch detection is built from scratch

---

## 🎛️ How It Works

1. The browser requests microphone access via `getUserMedia`
2. Audio is routed through an `AnalyserNode` for real-time frequency analysis
3. An autocorrelation algorithm detects the fundamental frequency
4. The closest musical note is calculated using equal temperament math
5. The cents deviation is displayed on a visual meter

---

## 🗺️ Roadmap

- [ ] Drop tuning support (Drop D, DADGAD, etc.)
- [ ] Dark/light theme toggle
- [ ] PWA support for offline use
- [ ] Tuning history and session stats
- [ ] MIDI input support
- [ ] Localization / i18n
- [ ] Mobile-optimized layout
- [ ] Strobe tuner mode for higher precision

---

## 🤝 Contributing

Contributions are welcome and appreciated! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to get involved.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💬 Acknowledgments

- Pitch detection inspired by the [autocorrelation method](https://en.wikipedia.org/wiki/Autocorrelation) for fundamental frequency estimation
- Built with accessibility guidance from [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

<p align="center">
  Made with ♪ by <a href="https://github.com/indjoov">indjoov</a> and the PitchCraft community
</p>
