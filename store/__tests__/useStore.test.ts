import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useStore } from '../useStore';
import * as db from '../../utils/db';

// Mock DB functions
jest.mock('../../utils/db', () => ({
    getStocks: jest.fn(),
    addStock: jest.fn(),
    deleteStock: jest.fn(),
    updateStock: jest.fn(),
}));

describe('useStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useStore.setState({
            stocks: [],
            isLoading: false,
            isSyncing: false,
            lastSynced: null
        });
    });

    it('refreshStocks should fetch from DB and update state', async () => {
        const mockStocks = [{ id: 1, symbol: 'TSLA', price: 200, change_percent: 5, timestamp: 123 }];
        (db.getStocks as jest.Mock).mockResolvedValue(mockStocks);

        const { result } = renderHook(() => useStore());

        await act(async () => {
            await result.current.refreshStocks();
        });

        expect(db.getStocks).toHaveBeenCalled();
        expect(result.current.stocks).toEqual(mockStocks);
        expect(result.current.isLoading).toBe(false);
    });

    it('addNewStock should call DB add and refresh', async () => {
        (db.getStocks as jest.Mock).mockResolvedValue([{ id: 1, symbol: 'NEW', price: 10, change_percent: 1, timestamp: 123 }]);

        const { result } = renderHook(() => useStore());

        await act(async () => {
            await result.current.addNewStock('NEW', 10, 1);
        });

        expect(db.addStock).toHaveBeenCalledWith('NEW', 10, 1);
        expect(db.getStocks).toHaveBeenCalled();
        expect(result.current.stocks).toHaveLength(1);
    });

    it('syncWithCloud should toggle isSyncing and update timestamp', async () => {
        jest.useFakeTimers();
        const { result } = renderHook(() => useStore());

        expect(result.current.isSyncing).toBe(false);
        expect(result.current.lastSynced).toBeNull();

        // Trigger sync inside act
        let promise: Promise<void>;
        act(() => {
            promise = result.current.syncWithCloud();
        });

        // Expect loading state
        expect(result.current.isSyncing).toBe(true);

        // Fast-forward time
        act(() => {
            jest.runAllTimers();
        });

        await act(async () => {
            await promise!;
        });

        expect(result.current.isSyncing).toBe(false);
        expect(result.current.lastSynced).toBeInstanceOf(Date);

        jest.useRealTimers();
    });
});
