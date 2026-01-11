import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: '#1e1e1e' },
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#1e1e1e',
                    borderTopColor: '#333',
                    platform: Platform.select({ ios: { position: 'absolute' } }),
                },
                tabBarActiveTintColor: '#4cc9f0',
                tabBarInactiveTintColor: '#888',
                sceneStyle: { backgroundColor: '#121212' },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    headerTitle: 'Market Overview',
                }}
            />
            <Tabs.Screen
                name="stocks"
                options={{
                    title: 'Stocks',
                    headerTitle: 'Manage Portfolio',
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Analytics',
                    headerTitle: 'Performance Stats',
                }}
            />
        </Tabs>
    );
}
