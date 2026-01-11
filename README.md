# Offline-First Expo Dashboard

A modern financial dashboard built with Expo SDK 52, featuring local SQLite storage, Zustand state management, and high-performance Victory charts.

## 🚀 Features
- **Offline-First**: All data is stored locally using `expo-sqlite`.
- **Live Charts**: Interactive price history using `victory-native`.
- **State Management**: Zero-boilerplate global state with `zustand`.
- **Cross-Platform**: Optimized for iOS and Android.

## 🛠 Tech Stack
- **Framework**: Expo SDK 52 (React Native 0.76)
- **Database**: expo-sqlite (Next Gen C++ implementation)
- **State**: Zustand
- **Charts**: Victory Native
- **Styling**: React Native StyleSheet (Dark Theme)

## 🏃‍♂️ Quick Start

### 1. Installation
This project requires nodejs.

```bash
# Install dependencies
npm install
```

## 💻 Development Setup

### Recommended Tools
1.  **Code Editor**: [VS Code](https://code.visualstudio.com/) with **Expo Tools** extension.
2.  **Database Viewer**: [SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) extension for VS Code to inspect local `.db` files.

### 🍎 Option A: Xcode Installed (Mac Only)
If you have the full Xcode IDE installed:
1.  Run `npx expo start`.
2.  Press `i` to launch the **iOS Simulator**.
3.  *Pros*: Rapid debugging, easy to inspect database files on disk.

### 📱 Option B: No Xcode (Recommended for Speed)
If you don't want to install the heavy Xcode (30GB+):
1.  Download **Expo Go** on your physical iPhone/Android.
2.  Run `npx expo start`.
3.  Scan the QR code with your phone.
4.  *Pros*: Test real offline behavior (Airplane mode), smooth 60fps animations.
5.  *Alternatives*: Use **Android Studio Emulator** (free, cross-platform) or the **Web** version (`w` key).

### 2. Running the App

```bash
# Start Expo server
npx expo start

# Run on Android Emulator
npx expo start --android

# Run on iOS Simulator
npx expo start --ios

# Run on Web (Limited DB support in this demo)
npx expo start --web
```

### 3. Usage
1.  **Dashboard**: Shows a chart of your most active stock.
2.  **Stocks**: Use this tab to Add stocks.
    *   Enter Symbol (e.g., `AAPL`), Price (e.g., `150`), and Change% (e.g., `1.5`).
    *   Add multiple entries for the same symbol with different prices to see the chart line grow!
3.  **Analytics**: View aggregated stats like Top Gainer and Total Portfolio Value.

## 🧪 Testing

This project includes a unit test suite using **Jest** and **React Test Renderer**.
We mock native modules (`expo-sqlite`, `react-native-reanimated`) to run tests in a Node.js environment.

### Running Tests
```bash
npm test
```

### What is Tested?
1.  **Database Utils** (`utils/db.ts`): Verifies that CRUD operations (Add, Get, Delete) generate the correct SQL queries.
2.  **Zustand Store** (`store/useStore.ts`): Verifies that actions update the global state correctly and interact with the database.

## 📱 Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for details on why we chose this stack.
