# Crypto Sudoku Public Assets

![Crypto Sudoku Logo](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Static assets for the Crypto Sudoku web application

[![Web Optimized](https://img.shields.io/badge/Web-Optimized-brightgreen.svg)](https://web.dev/fast/)
[![PWA Support](https://img.shields.io/badge/PWA-Supported-blue.svg)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This directory contains all public assets used in the Crypto Sudoku application, including images, fonts, sounds, and other static resources. These files are served directly by the web server and are accessible to the client without any processing.

## 📂 Directory Structure

```
public/
├── favicon.ico             # Browser tab icon (16x16)
├── favicon.svg             # Vector version of favicon
├── favicon-96x96.png       # Larger favicon for higher DPI displays
├── apple-touch-icon.png    # Icon for iOS home screen (180x180)
├── site.webmanifest        # Web app manifest for PWA support
├── robots.txt              # Instructions for web crawlers
├── sounds/                 # Game audio files
│   ├── correct.wav         # Sound for correct moves
│   ├── error.wav           # Sound for mistakes
│   ├── countdown.wav       # Game start countdown
│   ├── win.wav             # Victory sound
│   └── gameover.wav        # Game over sound
└── images/                 # Game images and graphics
    ├── logo.png            # Crypto Sudoku logo
    ├── backgrounds/        # Background images
    └── ui/                 # UI elements
```

## 🔊 Game Sounds

The `sounds` directory contains all audio files used in the game:

| Sound File | Purpose | Duration | Format |
|------------|---------|----------|--------|
| **correct.wav** | Played when making a correct move | 0.3s | WAV |
| **error.wav** | Played when making a mistake | 0.4s | WAV |
| **countdown.wav** | Played during game start countdown | 3.0s | WAV |
| **win.wav** | Played upon puzzle completion | 2.5s | WAV |
| **gameover.wav** | Played when reaching max mistakes | 1.8s | WAV |

All sound files are in WAV format for best browser compatibility and are optimized for size and quality.

## 🖼️ Images and Icons

| Asset | Purpose | Format | Size |
|-------|---------|--------|------|
| **favicon.ico** | Standard browser favicon | ICO | 16x16 |
| **favicon.svg** | Vector favicon for modern browsers | SVG | Scalable |
| **favicon-96x96.png** | High-resolution favicon | PNG | 96x96 |
| **apple-touch-icon.png** | iOS home screen icon | PNG | 180x180 |
| **logo.png** | Main application logo | PNG | 200x200 |

## 📱 PWA Support

The `site.webmanifest` file provides metadata for Progressive Web App support, enabling users to install the Crypto Sudoku application on their devices:

```json
{
  "name": "Crypto Sudoku",
  "short_name": "Sudoku",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#6366f1",
  "background_color": "#f8fafc",
  "display": "standalone",
  "start_url": "/"
}
```

## 🔧 Implementation

Assets in this directory are referenced in the application using relative paths:

```javascript
// In JavaScript
const correctSound = new Audio('/sounds/correct.wav');
correctSound.play();
```

```html
<!-- In HTML -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

## ⚡ Performance Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| **Image Compression** | All images are optimized with tools like ImageOptim | Reduced file sizes for faster loading |
| **SVG Usage** | Vector graphics used where appropriate | Crisp display at any resolution |
| **Audio Optimization** | WAV files compressed to smallest viable size | Faster loading with minimal quality loss |
| **Preloading** | Critical assets preloaded in HTML | Prevents render-blocking and improves UX |
| **Cache Control** | Proper cache headers for static assets | Reduces bandwidth and speeds up repeat visits |

## 🧩 Asset Guidelines

When adding new assets to this directory, please follow these guidelines:

### 📝 Naming Conventions
- Use lowercase with hyphens (e.g., `game-background.png`)
- Use descriptive names that indicate the asset's purpose
- Group related assets in folders with clear names

### 🎨 Image Formats
- **SVG**: Use for icons, logos, and simple vector graphics
- **PNG**: Use for graphics with transparency needs
- **JPEG**: Use for photographic images without transparency
- **WebP**: Consider for modern browsers when file size is critical

### 🎵 Audio Guidelines
- Keep audio files under 100KB when possible
- Use WAV format for maximum compatibility
- Ensure sounds are normalized to consistent volume levels
- Provide audio alternatives for accessibility

## 🔄 Updating Assets

When updating assets, follow this process:

1. Create new versions with the same dimensions/format as existing assets
2. Optimize new assets for web performance
3. Test with multiple browsers and devices
4. Update references in code if filenames change
5. Document any significant changes

## 🤝 Contributing

When contributing new assets:

1. Ensure assets are properly licensed for use
2. Optimize files for web use
3. Update this README if adding new asset categories
4. Test assets in different browsers and devices

## 📄 License

All assets in this directory are licensed under the MIT License unless otherwise specified - see the [LICENSE](../LICENSE.md) file for details.

---

<p align="center">
  <b>Crypto Sudoku: Play, Solve, Earn</b><br>
  <a href="https://cryptosudoku.xyz">Website</a> •
  <a href="https://twitter.com/CryptoSudokuG">Twitter</a> •
  <a href="https://discord.gg/8htQ6wn9Md">Discord</a> •
  <a href="https://t.me/cryptosudokugame">Telegram</a>
</p>
