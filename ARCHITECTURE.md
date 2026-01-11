# Architecture Decision Record (ADR)

## 1. Context
We are building a high-performance, offline-first financial dashboard for Android, iOS, and Web. The app requires:
- **Offline Capabilities**: Storing stock data locally.
- **High-Performance Charts**: Interactive financial charts (candle/line).
- **Global State**: Syncing DB state with UI.
- **Cross-Platform**: Web compatibility is a "nice to have" but mobile is priority.

## 2. Technology Selection

### A. Framework: Expo SDK 52
**Decision**: Use Expo SDK 52 (Managed Workflow).
**Why**:
- **New Architecture Support**: SDK 52 enables the "New Architecture" (Fabric/TurboModules) by default, offering native-like performance.
- **Developer Experience**: Feature-rich CLI (`npx expo`), OTA updates, and easy native module linking via Config Plugins.
**Alternatives Considered**:
- **React Native CLI (Bare)**: Higher maintenance cost for native upgrades. Expo Prebuild now solves the "native code access" limitation.

### B. Local Database: expo-sqlite
**Decision**: Use `expo-sqlite` (Next Gen).
**Why**:
- **Native Performance**: Based on the new native C++ infrastructure. Supports synchronous synchronous queries (essential for preventing UI flickers).
- **Simplicity**: Standard SQL syntax. Zero config for mobile.
- **Integration**: First-party support from Expo.
**Alternatives Considered**:
- **WatermelonDB**: Excellent for syncing with logic, but overkill for a simple dashboard. High setup complexity with decorators / babel plugins.
- **Realm**: Very fast, but adds significant app bundle size and uses a non-standard query language.
- **MMKV**: Only Key-Value storage, unsuitable for structured relational data (stocks, historical prices).

### C. State Management: Zustand
**Decision**: Use `zustand`.
**Why**:
- **Minimal Boilerplate**: No providers or complex reducers needed.
- **Performance**: Selectors allow components to only re-render when specific data changes.
- **Transient Updates**: Easy to update state outside of React components (e.g., inside DB listeners).
**Alternatives Considered**:
- **Redux / Redux Toolkit**: The industry standard, but introduces significant boilerplate (slices, thunks, providers) which slows down rapid development.
- **React Context**: Can lead to "provider hell" and unnecessary re-renders of the whole tree if not optimized carefully.

### D. Charting: Victory Native (Skia)
**Decision**: Use `victory-native` (powered by Shopify's React Native Skia).
**Why**:
- **Performance**: Uses the Skia 2D graphics engine (same as Chrome/Flutter) for 60-120fps animations.
- **Interactivity**: Supports complex gestures (pan, zoom) which are critical for financial charts.
**Alternatives Considered**:
- **react-native-svg-charts**: Uses SVG. Performance drops significantly with large datasets (like stock history).
- **react-native-chart-kit**: Easy to use but limited customization and "canned" look.

## 3. Web Compatibility Strategy
**Challenge**: `expo-sqlite` relies on native mobile SQLite.
**Strategy**:
- Use a Platform check.
- **Mobile**: Use `expo-sqlite` native.
- **Web**: Experimental support via WebSQL or a mock capability for the demo.

## 4. System Architecture Diagram
```mermaid
graph TD
    User[User] -->|Interacts| UI[UI Layer]
    
    subgraph UI_Layer [Screens]
        Dashboard[Dashboard]
        Stocks[Stocks CRUD]
        Analytics[Analytics]
    end
    
    UI -->|Reads/Writes State| Store[Zustand Store]
    
    Store -->|Async Actions| DB_Utils[DB Repository (db.ts)]
    
    subgraph Data_Layer [Data Persistence]
        DB_Utils -->|Platform.OS == ios/android| SQLite[(SQLite Database)]
        DB_Utils -->|Platform.OS == web| Mock[Mock Data (Memory)]
    end
    
    SQLite -->|Persisted Data| DB_Utils
    Mock -->|Ephemeral Data| DB_Utils
    DB_Utils -->|Updates| Store
```
