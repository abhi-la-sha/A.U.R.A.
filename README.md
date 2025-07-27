
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

![dashboard](https://github.com/user-attachments/assets/a51756c3-6d3c-4659-b27e-f0bf2e5e104b)


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
| **Backend**                   | **Python Scripts**            | For Log analysis and detection                      |
|                               | **Gemini LLM API**            | For Structured gemini responses and asking questions|



## 🏗️ Architecture & Data Flow

### System Architecture

<img width="3840" height="2703" alt="System architecture" src="https://github.com/user-attachments/assets/75970568-99eb-4926-a684-295713cff603" />


### Real-Time Data Flow

<img width="2560" height="3840" alt="Workflow diag" src="https://github.com/user-attachments/assets/bfe2a0eb-89ea-45ce-b3e5-e2cfe8e273e9" />


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

