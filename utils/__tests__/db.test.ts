import { Platform } from 'react-native';

// Mock values
const mockDate = 1700000000000;
jest.spyOn(Date, 'now').mockReturnValue(mockDate);

describe('Database Util', () => {
    let mockRunAsync: jest.Mock;
    let mockGetAllAsync: jest.Mock;

    // Dynamically loaded functions
    let addStock: any;
    let getStocks: any;
    let deleteStock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules(); // clears cache

        // 1. Get the FRESH mock instance of expo-sqlite that 'db.ts' will also receive
        const SQLite = require('expo-sqlite');

        mockRunAsync = jest.fn();
        mockGetAllAsync = jest.fn();

        // 2. Configure THIS instance
        (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue({
            execAsync: jest.fn(),
            runAsync: mockRunAsync,
            getAllAsync: mockGetAllAsync,
        });

        // 3. Now require the module under test
        const dbModule = require('../db');
        addStock = dbModule.addStock;
        getStocks = dbModule.getStocks;
        deleteStock = dbModule.deleteStock;
    });

    it('addStock should prepare correct INSERT statement', async () => {
        Platform.OS = 'ios';
        await addStock('AAPL', 150.0, 1.5);

        expect(mockRunAsync).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO stocks'),
            ['AAPL', 150.0, 1.5, mockDate]
        );
    });

    it('getStocks should return data from DB', async () => {
        Platform.OS = 'ios';
        const mockStocks = [
            { id: 1, symbol: 'AAPL', price: 150, change_percent: 1.5, timestamp: mockDate }
        ];
        mockGetAllAsync.mockResolvedValue(mockStocks);

        const result = await getStocks();
        expect(result).toEqual(mockStocks);
        expect(mockGetAllAsync).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM stocks'));
    });

    it('deleteStock should execute DELETE statement', async () => {
        Platform.OS = 'ios';
        await deleteStock(1);

        expect(mockRunAsync).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM stocks'),
            [1]
        );
    });

    it('should return mock data on Web', async () => {
        Platform.OS = 'web';
        const result = await getStocks();
        expect(result[0].symbol).toBe('MOCK');
    });
});
