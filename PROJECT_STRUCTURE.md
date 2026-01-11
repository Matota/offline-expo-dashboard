# 📂 Project Structure & Architecture

## 📁 File Types & Structure

### Logic & Data (`.ts`)
*   **`utils/db.ts`**: **Data Layer**. Direct SQLite database operations (SQL queries).
*   **`store/useStore.ts`**: **State Management**. The "brain" of the app.
*   **`utils/__tests__/db.test.ts`**: Unit tests for the database.
*   **`store/__tests__/useStore.test.ts`**: Unit tests for the store.

### UI Components (`.tsx`)
*   **`app/_layout.tsx`**: Main App Router configuration.
*   **`app/(tabs)/index.tsx`**: **Dashboard Screen** (Charts & Overview).
*   **`app/(tabs)/stocks.tsx`**: **Stock Management Screen** (Add/Delete).
*   **`app/(tabs)/analytics.tsx`**: **Analytics Screen** (Stats).

---

## 🏗 Design Patterns

We follow a **Modern React Architecture** combining two key patterns:

### 1. Repository Pattern (`utils/db.ts`)
*   We abstract all raw SQL into a dedicated "Repository" file.
*   The UI never sees `SELECT * FROM...`. It just calls `getStocks()`.
*   **Benefit**: Decouples the UI from the specific database implementation.

### 2. Flux-like State Pattern (`store/useStore.ts`)
*   Implemented via **Zustand**.
*   **Flow**: Action ("Sync", "Add Stock") -> Store (Updates State) -> View (React UI Re-renders).
*   **Benefit**: State is predictable and decoupled from UI components.

---

## 🧠 Where is the Business Logic?

The business logic is **separated** from the UI:

1.  **Core Application Logic**: Lives in **`store/useStore.ts`**.
    *   *Example*: The `syncWithCloud` function manages the loading state, the timer, and the "last synced" timestamp.
    *   *Example*: `refreshStocks` orchestrates fetching data and updating the view.

2.  **Data Logic**: Lives in **`utils/db.ts`**.
    *   *Example*: Formatting data for the database, constructing SQL queries, and handling platform-specifics (Web vs Native).

The `.tsx` files (Screens) are purely for **Presentation**—they just display data from the Store and trigger Actions.
