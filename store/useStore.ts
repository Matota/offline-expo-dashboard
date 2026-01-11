import { create } from 'zustand';
import { Stock, getStocks, addStock, deleteStock, updateStock } from '../utils/db';

interface StoreState {
    stocks: Stock[];
    isLoading: boolean;
    refreshStocks: () => Promise<void>;
    addNewStock: (symbol: string, price: number, change: number) => Promise<void>;
    removeStock: (id: number) => Promise<void>;
    modifyStock: (id: number, price: number, change: number) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    stocks: [],
    isLoading: false,

    refreshStocks: async () => {
        set({ isLoading: true });
        try {
            const stocks = await getStocks();
            set({ stocks, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch stocks', error);
            set({ isLoading: false });
        }
    },

    addNewStock: async (symbol, price, change) => {
        await addStock(symbol, price, change);
        await get().refreshStocks();
    },

    removeStock: async (id) => {
        await deleteStock(id);
        await get().refreshStocks();
    },

    modifyStock: async (id, price, change) => {
        await updateStock(id, price, change);
        await get().refreshStocks();
    },
}));
