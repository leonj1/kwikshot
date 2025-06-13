# 🎬 KwikShot

<div align="center">

> **🚀 Built by the [AugmentCode.com](https://www.augmentcode.com) Community using AugmentCode Tool**
>
> *Empowering developers to build better software faster through AI-assisted development*

![KwikShot Logo](https://img.shields.io/badge/KwikShot-Screen%20Recorder-blue?style=for-the-badge&logo=video&logoColor=white)

**Professional Screen Recorder & Video Editor**

*Capture your screen, webcam, and audio with professional quality*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-36.4.0-47848F?style=flat&logo=electron&logoColor=white)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![GitHub stars](https://img.shields.io/github/stars/your-username/kwikshot?style=social)](https://github.com/your-username/kwikshot/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/kwikshot?style=social)](https://github.com/your-username/kwikshot/network/members)
[![GitHub issues](https://img.shields.io/github/issues/your-username/kwikshot)](https://github.com/your-username/kwikshot/issues)
[![GitHub release](https://img.shields.io/github/v/release/your-username/kwikshot)](https://github.com/your-username/kwikshot/releases)

[Download](#-installation) • [Features](#-features) • [Screenshots](#-screenshots) • [Documentation](#-usage) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎥 **Recording Capabilities**
- **Multi-Source Recording**: Capture screen, webcam, and audio simultaneously
- **High-Quality Output**: Support for 1080p, 1440p, and 4K recording
- **Flexible Frame Rates**: 30 FPS and 60 FPS options
- **Real-time Preview**: See what you're recording in real-time

### ✂️ **Video Editing**
- **Timeline Editor**: Professional timeline with drag-and-drop functionality
- **Trim & Cut**: Precise video trimming and cutting tools
- **Multiple Tracks**: Separate video and audio track management
- **Export Options**: Multiple format support (MP4, MOV, WebM)

### 🎨 **Modern Interface**
- **Dark Theme**: Beautiful dark UI with glass morphism effects
- **Responsive Design**: Adaptive layout for different screen sizes
- **Smooth Animations**: Framer Motion powered transitions
- **Keyboard Shortcuts**: Efficient workflow with hotkeys

### ⚡ **Performance**
- **Cross-Platform**: Windows, macOS, and Linux support
- **Auto-Updates**: Built-in update mechanism
- **Lightweight**: Optimized for performance and low resource usage
- **Native Integration**: Deep OS integration for seamless experience

---

## 📸 Screenshots

<div align="center">

### 🎥 Recording Interface
*Intuitive recording controls with real-time preview*


### ✂️ Video Editor
*Professional timeline editor with drag-and-drop functionality*


### 🎨 Modern Dark UI
*Beautiful dark theme with glass morphism effects*


</div>

---

## 🚀 Installation

### Download Pre-built Binaries

**Windows**
```bash
# Download the latest Windows installer
curl -L -o kwikshot-setup.exe https://github.com/your-username/kwikshot/releases/latest/download/kwikshot-setup.exe
```

**macOS**
```bash
# Download the latest macOS DMG
curl -L -o kwikshot.dmg https://github.com/your-username/kwikshot/releases/latest/download/kwikshot.dmg
```

**Linux**
```bash
# Download the latest Linux AppImage
curl -L -o kwikshot.AppImage https://github.com/your-username/kwikshot/releases/latest/download/kwikshot.AppImage
chmod +x kwikshot.AppImage
```

### Build from Source

**Prerequisites**
- Node.js 18+
- npm or yarn
- Git

**Clone and Install**
```bash
git clone https://github.com/your-username/kwikshot.git
cd kwikshot
npm install
```

**Development**
```bash
npm run dev
```

**Build for Production**
```bash
# Build for current platform
npm run build

# Build for all platforms
npm run dist

# Platform-specific builds
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

### 🐳 Docker Development (Recommended)

**Prerequisites**
- Docker
- Make (included on macOS/Linux, install via chocolatey/scoop on Windows)

**Quick Start with Docker**
```bash
# Clone the repository
git clone https://github.com/your-username/kwikshot.git
cd kwikshot

# Build the Docker image
make build

# Start the development server (default port 3000)
make start

# Or start on a custom port
make start HOST_PORT=4545
# Alternative syntax: HOST_PORT=4545 make start
```

**Docker Commands**
```bash
# Build the Docker image
make build

# Start the container
make start

# Start with custom host port
make start HOST_PORT=8080
HOST_PORT=4545 make start

# Stop the container
make stop

# Restart the container
make restart

# View container logs
make logs

# Check container status
make status

# Run tests
make test

# Clean up (remove container and image)
make clean

# Show help with all available commands
make help
```

**Port Configuration**
- **Default**: Application runs on http://localhost:3000
- **Custom Port**: Use `HOST_PORT=XXXX make start` to run on a different port
- **Container Port**: The app always runs on port 3000 inside the container
- **Host Port**: The port you access from your browser (configurable)

---

## 📖 Usage

### Quick Start

**For Development (Docker)**
```bash
git clone https://github.com/your-username/kwikshot.git
cd kwikshot
make build && make start
# Open http://localhost:3000 in your browser
```

**For End Users**
1. **Launch KwikShot** from your applications menu
2. **Select Recording Sources** - Choose your screen, webcam, and microphone
3. **Configure Settings** - Set resolution, frame rate, and quality
4. **Start Recording** - Click the record button to begin
5. **Edit Your Video** - Switch to the editor to trim and enhance
6. **Export** - Save your final video in your preferred format

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Start/Stop Recording | `Ctrl/Cmd + R` |
| Pause Recording | `Ctrl/Cmd + P` |
| Switch to Editor | `Ctrl/Cmd + E` |
| Export Video | `Ctrl/Cmd + S` |
| Play/Pause | `Space` |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Desktop Framework**: Electron 36
- **Styling**: Tailwind CSS 3 + Framer Motion
- **Video Processing**: FFmpeg
- **State Management**: Zustand
- **Build Tool**: Webpack 5
- **Icons**: Lucide React

---

## 🏗️ Project Structure

```
kwikshot/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React frontend
│   │   ├── components/ # UI components
│   │   ├── styles/     # CSS and styling
│   │   └── utils/      # Utility functions
│   └── shared/         # Shared types and utilities
├── build/              # Build configuration
├── dist/               # Built application
└── release/            # Distribution packages
```

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

**Option 1: Docker (Recommended)**
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/kwikshot.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Start development environment: `make build && make start`
5. Make your changes and test: `make test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

**Option 2: Local Development**
1. Fork the repository
2. Clone your fork and install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Start development server: `npm run dev`
5. Make your changes and test thoroughly
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

**Built by the Community**

This project was developed by the amazing community at **[www.augmentcode.com](https://www.augmentcode.com)** using the **AugmentCode** development tool.

AugmentCode empowers developers to build better software faster through AI-assisted development and collaborative coding tools.

---

## 🎯 Roadmap

### Upcoming Features
- [ ] **Live Streaming**: Direct streaming to YouTube, Twitch, and other platforms
- [ ] **Advanced Editing**: Color correction, filters, and effects
- [ ] **Cloud Storage**: Integration with Google Drive, Dropbox, and OneDrive
- [ ] **Collaboration**: Real-time collaborative editing
- [ ] **Mobile App**: Companion mobile app for remote control
- [ ] **AI Features**: Auto-transcription and smart editing suggestions

### Recent Updates
- [x] **v0.1.0**: Initial release with basic recording and editing
- [x] **Modern UI**: Dark theme with glass morphism effects
- [x] **Cross-platform**: Windows, macOS, and Linux support

---

## 📊 System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.14, or Ubuntu 18.04+
- **RAM**: 4 GB
- **Storage**: 500 MB free space
- **Graphics**: DirectX 11 compatible

### Recommended Requirements
- **OS**: Windows 11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8 GB or more
- **Storage**: 2 GB free space
- **Graphics**: Dedicated GPU for hardware acceleration

---

## 🔧 Configuration

### Recording Settings
```json
{
  "video": {
    "resolution": "1920x1080",
    "frameRate": 30,
    "quality": "high",
    "codec": "h264"
  },
  "audio": {
    "sampleRate": 44100,
    "bitRate": 128,
    "channels": 2
  }
}
```

### Export Formats
- **MP4**: Best for general use and sharing
- **MOV**: Ideal for professional editing workflows
- **WebM**: Perfect for web deployment
- **AVI**: Legacy format support

---

## 🔧 Troubleshooting

### Docker Issues

**Port Already in Use**
```bash
# Error: Bind for 0.0.0.0:3000 failed: port is already allocated
# Solution: Use a different port
HOST_PORT=4545 make start
```

**Container Won't Start**
```bash
# Check container status
make status

# View logs for errors
make logs

# Clean up and rebuild
make clean
make build
make start
```

**Permission Issues (Linux)**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in, then try again
```

### Make Command Not Found

**Windows**
```bash
# Install via Chocolatey
choco install make

# Or via Scoop
scoop install make
```

**macOS**
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/kwikshot/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/kwikshot/discussions)
- 💬 **Community**: [AugmentCode Community](https://www.augmentcode.com)
- 📚 **Documentation**: [Wiki](https://github.com/your-username/kwikshot/wiki)

---

<div align="center">

**Made with ❤️ by the [AugmentCode](https://www.augmentcode.com) Community**

⭐ Star this repo if you find it helpful!

</div>
