# Face Recognition System

A custom face detection and recognition module built from scratch using React + TypeScript. This system detects faces in real-time webcam input, counts them, and identifies distinct individuals without relying on external face recognition libraries.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── VideoFeed/       # Webcam video display
│   ├── FaceOverlay/     # Face detection overlay
│   └── Controls/        # UI controls and settings
├── core/                # Core face recognition logic
│   ├── VideoStreamer.ts
│   ├── Preprocessor.ts
│   ├── FaceDetector.ts
│   └── FaceRecognizer.ts
├── utils/               # Helper functions
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
```

## 🎯 Features

- **Real-time Face Detection**: Custom algorithm for detecting faces in video streams
- **Face Recognition**: Consistent ID assignment across frames
- **Live Count Display**: Real-time count of detected faces
- **Custom Implementation**: Built from scratch without external face recognition libraries
- **TypeScript**: Full type safety with strict mode enabled
- **Performance Optimized**: Maintains 30 FPS during face detection

## 🛠 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions

## 📖 Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation, algorithm descriptions, and development guidelines.

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Core algorithm testing with sample data
- **Integration Tests**: Full pipeline from webcam to recognition
- **Performance Tests**: Frame rate and memory usage benchmarks

## 🤝 Contributing

This project uses structured GitHub issues for task management. See the issue templates in `.github/ISSUE_TEMPLATE/` for the required format.

## 📄 License

This project is private and proprietary.