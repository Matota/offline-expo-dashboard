import { Platform } from 'react-native';

// Type definition for Stock
export interface Stock {
    id: number;
    symbol: string;
    price: number;
    change_percent: number;
    timestamp: number;
}

// We only import SQLite on native platforms to avoid "Native Module not found" on Web
let SQLite: any = null;
if (Platform.OS !== 'web') {
    SQLite = require('expo-sqlite');
}

let db: any = null;

export const initDB = async () => {
    // 1. Web Guard
    if (Platform.OS === 'web') {
        console.warn('SQLite is not supported on web. Using mock data.');
        return;
    }

    // 2. Native Initialization
    try {
        // Use openDatabaseAsync if available (newer versions), otherwise fallback
        if (SQLite.openDatabaseAsync) {
            db = await SQLite.openDatabaseAsync('stocks.db');
            await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            price REAL NOT NULL,
            change_percent REAL NOT NULL,
            timestamp INTEGER NOT NULL
        );
        `);
        } else {
            // Fallback for mixed versions
            db = SQLite.openDatabase('stocks.db');
            db.transaction((tx: any) => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS stocks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    price REAL NOT NULL,
                    change_percent REAL NOT NULL,
                    timestamp INTEGER NOT NULL
                );`
                );
            });
        }
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const getStocks = async (): Promise<Stock[]> => {
    if (Platform.OS === 'web') {
        return [
            { id: 1, symbol: 'MOCK', price: 150.50, change_percent: 1.5, timestamp: Date.now() - 100000 },
            { id: 2, symbol: 'WEB', price: 200.00, change_percent: -0.5, timestamp: Date.now() },
        ];
    }

    if (!db) {
        await initDB();
    }
    if (!db) return [];

    try {
        if (db.getAllAsync) {
            return await db.getAllAsync('SELECT * FROM stocks ORDER BY id DESC');
        } else {
            return new Promise((resolve, reject) => {
                db.transaction((tx: any) => {
                    tx.executeSql(
                        'SELECT * FROM stocks ORDER BY id DESC',
                        [],
                        (_: any, { rows: { _array } }: any) => resolve(_array),
                        (_: any, error: any) => reject(error)
                    );
                });
            });
        }
    } catch (error) {
        console.error('Error getting stocks:', error);
        return [];
    }
};

export const addStock = async (symbol: string, price: number, change_percent: number) => {
    if (Platform.OS === 'web') return;
    if (!db) await initDB();
    if (!db) return;

    try {
        if (db.runAsync) {
            await db.runAsync(
                'INSERT INTO stocks (symbol, price, change_percent, timestamp) VALUES (?, ?, ?, ?)',
                [symbol, price, change_percent, Date.now()]
            );
        } else {
            db.transaction((tx: any) => {
                tx.executeSql('INSERT INTO stocks (symbol, price, change_percent, timestamp) VALUES (?, ?, ?, ?)', [symbol, price, change_percent, Date.now()]);
            });
        }
    } catch (error) {
        console.error('Error adding stock:', error);
    }
};

export const updateStock = async (id: number, price: number, change_percent: number) => {
    if (Platform.OS === 'web') return;
    if (!db) await initDB();
    if (!db) return;

    try {
        if (db.runAsync) {
            await db.runAsync(
                'UPDATE stocks SET price = ?, change_percent = ?, timestamp = ? WHERE id = ?',
                [price, change_percent, Date.now(), id]
            );
        } else {
            db.transaction((tx: any) => {
                tx.executeSql('UPDATE stocks SET price = ?, change_percent = ?, timestamp = ? WHERE id = ?', [price, change_percent, Date.now(), id]);
            });
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
};

export const deleteStock = async (id: number) => {
    if (Platform.OS === 'web') return;
    if (!db) await initDB();
    if (!db) return;

    try {
        if (db.runAsync) {
            await db.runAsync('DELETE FROM stocks WHERE id = ?', [id]);
        } else {
            db.transaction((tx: any) => {
                tx.executeSql('DELETE FROM stocks WHERE id = ?', [id]);
            });
        }
    } catch (error) {
        console.error('Error deleting stock:', error);
    }
};
