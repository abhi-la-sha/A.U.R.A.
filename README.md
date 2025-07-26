
# PROJECT AURA - Cyber-Financial Threat Fusion Platform

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![React](https://img.shields.io/badge/React-18.3.1-61dafb) ![Three.js](https://img.shields.io/badge/Three.js-0.168.0-000000)

A cutting-edge, real-time cyber threat monitoring and visualization platform that combines advanced 3D graphics, live data streaming, and intelligent threat analysis to provide comprehensive security insights.

## 🌟 Features

### Real-Time Threat Monitoring
- **Live Data Stream**: Continuous monitoring of global cyber threats.
- **Geographic Visualization**: 3D globe with animated threat connections.
- **Threat Classification**: Automated categorization of attack types and severity levels.
- **Multi-Source Intelligence**: Integration of various threat intelligence feeds.

### Advanced Visualization
- **3D Interactive Globe**: Real-time visualization of the global threat landscape.
- **3D Heatmap**: Time-based severity analysis with day/hour granularity.
- **Animated Effects**: Dynamic visual effects for threat events.
- **Responsive Design**: Optimized for various screen sizes and devices.

### Intelligence Analytics
- **Threat Statistics**: Real-time aggregation of threat metrics.
- **Pattern Recognition**: Identification of attack patterns and trends.
- **Severity Mapping**: Advanced severity classification system.
- **Geographic Analysis**: Country and region-based threat analysis.

## 🎮 Usage Guide

### Dashboard Overview
The AURA dashboard consists of four main components:

1.  **Left Panel - Threat Statistics**:
    -   Real-time threat metrics.
    -   System status indicators.
    -   Top threat types and source countries.

2.  **Center Panel - 3D Visualization**:
    -   Toggle between **Globe** and **Heatmap** views.
    -   Interactive 3D threat visualization.
    -   Real-time threat connections and effects.

3.  **Right Panel - Live Ticker**:
    -   Chronological threat event feed.
    -   Detailed threat information.
    -   Color-coded severity indicators.

4.  **Header - System Controls**:
    -   View toggle buttons.
    -   Analysis tools.
    -   System status and timestamp.

## 🚀 Technology Stack

| Category                      | Technology / Library          | Description                                         |
| ----------------------------- | ----------------------------- | --------------------------------------------------- |
| **Core Framework**            | **React 18.3.1**              | Modern React with concurrent features.              |
|                               | **TypeScript**                | Type-safe development.                              |
|                               | **Vite**                      | Lightning-fast build tool and dev server.           |
| **3D & Visualization**        | **Three.js 0.168.0**          | Advanced 3D graphics library.                       |
|                               | **@react-three/fiber 8.18.0** | React renderer for Three.js.                        |
|                               | **@react-three/drei 9.122.0** | Useful helpers for React Three Fiber.               |
| **UI & Styling**              | **Tailwind CSS**              | A utility-first CSS framework.                      |
|                               | **shadcn/ui**                 | Modern, accessible component library.               |
|                               | **Framer Motion**             | Smooth animations and transitions.                  |
|                               | **Lucide React**              | Beautiful and consistent icons.                     |
| **State & Data Management**   | **React Query**               | Server state management and caching.                |
|                               | **React Hook Form**           | Performant and flexible form handling.              |
|                               | **Zod**                       | TypeScript-first schema validation.                 |

## 🏗️ Architecture & Data Flow

### High-Level Architecture
```
graph TB
    subgraph "Frontend Layer"
        A[React Dashboard] --> B[3D Globe Visualization]
        A --> C[Threat Statistics]
        A --> D[Live Ticker]
        A --> E[3D Heatmap]
    end

    subgraph "Visualization Engine"
        B --> F[Three.js/React-Three-Fiber]
        E --> F
        F --> G[WebGL Renderer]
    end

    subgraph "Data Processing"
        H[Mock Data Generator] --> I[Threat Event Processor]
        I --> J[Severity Classifier]
        I --> K[Geographic Mapper]
    end

    subgraph "State Management"
        L[React State] --> M[Event Store]
        M --> N[Real-time Updates]
    end

    H --> A
    J --> A
    K --> A

    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style I fill:#e8f5e8
```

### Component Architecture
```
graph TD
    A[AuraDashboard] --> B[ThreatStats]
    A --> C[ThreatGlobe]
    A --> D[LiveTicker]
    A --> E[ThreatHeatmap]

    C --> F[Globe3D]
    C --> G[ThreatConnections]
    C --> H[EnergyCore]
    C --> I[ParticleSystem]

    E --> J[Heatmap3D]
    E --> K[HeatmapBar]
    E --> L[AxisLabels]

    B --> M[StatCard]
    B --> N[SystemStatus]

    D --> O[EventFeed]
    D --> P[EventItem]

    style A fill:#ff6b6b
    style C fill:#4ecdc4
    style E fill:#45b7d1
    style B fill:#96ceb4
    style D fill:#feca57
```

### Real-Time Data Flow
```
sequenceDiagram
    participant DG as Data Generator
    participant EP as Event Processor
    participant DS as Dashboard State
    participant TG as Threat Globe
    participant TH as Threat Heatmap
    participant TS as Threat Stats
    participant LT as Live Ticker

    DG->>EP: Generate Threat Event
    EP->>EP: Process & Classify
    EP->>DS: Update Event Store
    DS->>TG: Stream Events
    DS->>TH: Update Heatmap Data
    DS->>TS: Calculate Statistics
    DS->>LT: Add to Feed

    Note over TG,LT: Real-time UI Updates
```

## 🛠️ Installation & Setup

### Prerequisites
-   **Node.js**: Version 18.0 or higher
-   **npm**: Version 8.0 or higher (or `yarn`/`pnpm` equivalent)

### Quick Start
```
# Clone the repository
git clone 
cd project-aura

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser and navigate to
# http://localhost:5173
```

### Available Scripts
```
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint
```

## 🎨 Customization

### Theming
The application uses a comprehensive design system defined in:
- `src/index.css`: CSS custom properties and global styles.
- `tailwind.config.ts`: Tailwind CSS configuration.
- Component-specific styling with semantic tokens.

### Adding New Threat Types
Modify the `attackTypes` array in the `generateThreatEvent` function:
```
// In AuraDashboard.tsx
const attackTypes = [
  'DDoS', 'Malware', 'Phishing', 'Ransomware',
  'Data Breach', 'Your-New-Type'
];
```

### Customizing Visualizations
Adjust values in `ThreatGlobe.tsx` to modify the globe's appearance:
```
// Modify globe appearance in ThreatGlobe.tsx
const globeRadius = 50; // Adjust globe size
const threatConnectionOpacity = 0.8; // Connection transparency
const particleCount = 1000; // Particle density
```

## 📈 Performance Optimization

-   **Event Management**: Limits active events to 100 and efficiently cleans up old events to manage memory.
-   **3D Rendering**: Uses Level-of-Detail (LOD), frustum culling, and optimized geometries to ensure smooth rendering.
-   **Bundle Optimization**: Employs code splitting, tree shaking, and asset compression for a smaller production bundle and faster load times.

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:
```
# Development
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3001

# Production
VITE_API_URL=https://api.aura-platform.com
VITE_WS_URL=wss://ws.aura-platform.com
```

### Build Configuration
The build process can be customized in `vite.config.ts`:
```
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: true,
    chunkSizeWarningLimit: 1000
  }
});
```

## 🧪 Testing

Execute tests using the following scripts:

```
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Generate a test coverage report
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run visual regression tests
npm run test:visual
```

## 📦 Deployment

### Production Build
1.  Generate the production-ready assets:
    ```
    npm run build
    ```
2.  Test the production build locally before deploying:
    ```
    npm run preview
    ```

