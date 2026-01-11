import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { initDB } from '../utils/db';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    const refreshStocks = useStore((state) => state.refreshStocks);

    useEffect(() => {
        const setup = async () => {
            await initDB();
            await refreshStocks();
        };
        setup();
    }, []);

    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
                <Stack.Screen name="(tabs)" />
            </Stack>
        </>
    );
}
