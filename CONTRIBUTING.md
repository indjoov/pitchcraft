# Contributing to PitchCraft

Thank you for your interest in contributing to PitchCraft! Whether you're fixing a bug, adding a new instrument, improving accessibility, or suggesting a feature — every contribution makes this project better for musicians everywhere.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Adding a New Instrument](#adding-a-new-instrument)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior by opening an issue.

We are committed to providing a welcoming and inclusive experience for everyone, regardless of ability, age, body size, disability, ethnicity, gender identity, level of experience, nationality, race, religion, or sexual orientation.

---

## How Can I Contribute?

### 🐛 Report a Bug
Open an issue with the **Bug Report** template. Include:
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS information
- Screenshots or screen recordings if applicable

### 💡 Suggest a Feature
Open an issue with the **Feature Request** template. Describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

### 🎸 Add a New Instrument
We'd love to support more instruments! See [Adding a New Instrument](#adding-a-new-instrument) below.

### ♿ Improve Accessibility
Accessibility is a core value of PitchCraft. If you find barriers for users with disabilities, please report them or submit a fix. These contributions are especially valued.

### 🌍 Add a Translation
We plan to support multiple languages. If you'd like to help translate the UI, open an issue to discuss the localization approach.

### 📝 Improve Documentation
Found a typo? Want to clarify setup steps? Documentation PRs are always welcome.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/pitchcraft.git
   cd pitchcraft
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Start the dev server:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

1. Make your changes in the feature branch
2. Test your changes in multiple browsers (Chrome, Firefox, Safari if possible)
3. Test with keyboard navigation (Tab, Enter, Escape)
4. If you changed UI, test with a screen reader if you can (VoiceOver on Mac, NVDA on Windows)
5. Run the linter: `npm run lint`
6. Commit with a clear message (see below)

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add mandolin instrument support
fix: correct pitch detection for low frequencies
a11y: add aria-label to tuning buttons
docs: update README with new instruments
style: adjust meter colors for better contrast
```

Prefixes: `feat`, `fix`, `a11y`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Pull Request Process

1. Update the README if your change adds visible features
2. Make sure your code follows the style guide below
3. Open a Pull Request against the `main` branch
4. Fill out the PR template with a description of your changes
5. Link any related issues
6. Wait for a review — maintainers will respond within a few days

### PR Checklist

- [ ] Code follows the project style guide
- [ ] All interactive elements are keyboard accessible
- [ ] ARIA labels are added where appropriate
- [ ] Tested in at least 2 browsers
- [ ] No console errors or warnings
- [ ] README updated if needed

---

## Style Guide

### Code
- Use functional React components with hooks
- Use `const` by default, `let` when reassignment is needed
- Keep components focused — split large components into smaller ones
- Use descriptive variable names
- Comment complex logic (especially audio/DSP code)

### CSS / Styling
- Use inline styles or CSS modules (consistent with the existing codebase)
- Support the theme system — use `theme.bg`, `theme.text`, etc.
- Respect `reducedMotion` — wrap animations in a motion check
- Respect `largeText` — multiply font sizes by `textScale`
- Respect `highContrast` — ensure sufficient contrast ratios

### Naming
- Components: `PascalCase` (e.g., `GuitarSVG`)
- Functions: `camelCase` (e.g., `getClosestNote`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `NOTE_FREQUENCIES`)
- Files: `kebab-case` or `camelCase` matching the export

---

## Accessibility Guidelines

Accessibility is not optional in PitchCraft. All contributions must meet these standards:

1. **Keyboard Navigation** — Every interactive element must be reachable and operable with keyboard alone
2. **Screen Reader Support** — Use semantic HTML elements, `aria-label`, `aria-live`, `role`, and `aria-pressed` / `aria-checked` where appropriate
3. **Color Contrast** — Meet WCAG 2.1 AA contrast ratios (4.5:1 for text, 3:1 for large text)
4. **Motion** — All animations must respect the `reducedMotion` setting
5. **Text Scaling** — All text must respond to the `largeText` setting
6. **Alt Text** — SVG illustrations use `aria-hidden="true"` since they are decorative; functional images need descriptive labels
7. **Focus Indicators** — Never remove focus outlines without providing an alternative

---

## Adding a New Instrument

Want to add support for a new instrument? Here's how:

### 1. Add the instrument data

In `tuner.jsx`, add an entry to the `INSTRUMENTS` array:

```javascript
{
  id: "your-instrument",
  name: "Your Instrument",
  emoji: "🎵",
  tuning: ["Note1", "Note2", "Note3"],  // Standard tuning notes with octave
  color: "#HEX",                         // A distinctive brand color
  description: "Brief description",
  strings: 3,                            // Number of strings/courses
}
```

### 2. Create an SVG illustration

Create a new component following the existing pattern:

```javascript
function YourInstrumentSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* Your illustration here */}
    </svg>
  );
}
```

Guidelines for SVG illustrations:
- Use the `color` prop for fills and strokes — this enables theming
- Keep viewBox at `0 0 120 120` for consistency
- Use `aria-hidden="true"` since these are decorative
- Keep the illustration recognizable at 48px (the selector size)
- Use gradients and opacity for depth

### 3. Register the SVG

Add it to the `InstrumentSVGs` object:

```javascript
const InstrumentSVGs = {
  // ... existing entries
  "your-instrument": YourInstrumentSVG,
};
```

### 4. Test

- Verify the tuning frequencies are correct
- Check that string buttons play the right reference tones
- Test at both 48px (selector) and 100px (detail view) sizes
- Verify keyboard and screen reader accessibility

---

## Questions?

If you're unsure about anything, open an issue or start a discussion. There are no silly questions — we're here to help you contribute.

Thank you for helping make PitchCraft better for everyone! 🎵
