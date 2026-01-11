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

## 📱 Architecture
See [architecture_decisions.md](brain/4794f27b-97fc-47f6-9fa8-855e1b31654f/architecture_decisions.md) for details on why we chose this stack.
