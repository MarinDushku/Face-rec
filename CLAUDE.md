# Face Recognition Project - Claude Code Configuration

## Project Overview

Custom face detection and recognition module built from scratch using React + TypeScript. The system detects faces in real-time webcam input, counts them, and identifies distinct individuals without relying on external face recognition libraries.

## Architecture Overview

### Core Modules

- **VideoStreamer**: Handles webcam capture, frame rate management, and canvas rendering
- **Preprocessor**: Frame preprocessing including grayscale conversion, normalization, and resizing
- **FaceDetector**: Custom face detection algorithm implementation (sliding-window classifier or lightweight CNN)
- **FaceRecognizer**: Recognition logic for assigning consistent IDs across frames using descriptor matching
- **UIOverlay**: Real-time UI showing bounding boxes, face count, and identifier labels

### Data Flow

```
Webcam → VideoStreamer → Preprocessor → FaceDetector → FaceRecognizer → UIOverlay
```

## Algorithm Descriptions

### Face Detection Approach

- **Method**: Sliding window classifier using Haar-like features or lightweight CNN
- **Implementation**: Custom algorithm without external face detection libraries
- **Output**: Bounding box coordinates for detected faces

### Recognition Strategy

- **Feature Extraction**: Generate face descriptors using pixel intensity patterns or simple neural network
- **Matching**: Euclidean distance comparison between current and stored descriptors
- **Tracking**: Maintain face IDs across frames with confidence scoring
- **Threshold**: Configurable similarity threshold for new vs existing faces

## Tech Stack & Guidelines

### Core Technologies

- **Frontend**: React 18+ with TypeScript (strict mode)
- **Build Tool**: Vite for fast development and building
- **Styling**: CSS Modules or Tailwind CSS
- **Canvas**: HTML5 Canvas for video rendering and overlay graphics

### Code Quality

- **TypeScript**: Strict mode enabled, no `any` types
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with consistent configuration
- **Testing**: Vitest for unit tests, Testing Library for React components

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run unit tests
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run format       # Format code with Prettier
```

## Testing Strategy

### Unit Tests

- **VideoStreamer**: Mock webcam access, test frame capture
- **Preprocessor**: Test image processing functions with sample data
- **FaceDetector**: Test detection algorithm with known face images
- **FaceRecognizer**: Test descriptor generation and matching logic
- **UIOverlay**: Test React component rendering and state management

### Integration Tests

- **End-to-end**: Full pipeline from webcam to face recognition
- **Performance**: Frame rate benchmarks and memory usage
- **Browser Compatibility**: Cross-browser webcam API testing

## CI/CD Pipeline

### GitHub Actions Workflow

- **On Push**: Run linting, type checking, and unit tests
- **On PR**: Full test suite including integration tests
- **Auto-format**: Prettier formatting checks
- **Build Verification**: Ensure production build succeeds

### Quality Gates

- All tests must pass
- TypeScript compilation without errors
- ESLint rules compliance
- Code coverage minimum 80%

## Project Structure

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

## Development Workflow

### Issue Tracking

- Use structured GitHub issues with predefined templates
- Each issue includes: type, status, dependencies, priority, description
- Link issues to specific commits and PRs

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `fix/*`: Bug fix branches

## Performance Targets

- **Frame Rate**: Maintain 30 FPS during face detection
- **Detection Latency**: < 100ms per frame
- **Memory Usage**: < 200MB peak memory consumption
- **CPU Usage**: < 70% on modern hardware

## Security Considerations

- Webcam access permissions handled properly
- No face data stored permanently without consent
- Client-side only processing (no data transmission)
- Privacy-first approach to face recognition
