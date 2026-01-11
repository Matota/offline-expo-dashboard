import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../../store/useStore';
import { Stack } from 'expo-router';

export default function AnalyticsScreen() {
    const { stocks } = useStore();

    const stats = useMemo(() => {
        if (stocks.length === 0) return null;

        const totalValue = stocks.reduce((sum, s) => sum + s.price, 0);
        const sortedByChange = [...stocks].sort((a, b) => b.change_percent - a.change_percent);
        const topGainer = sortedByChange[0];
        const topLoser = sortedByChange[sortedByChange.length - 1];

        // Group by symbol to count distinct assets
        const symbols = new Set(stocks.map(s => s.symbol));

        return {
            totalValue,
            topGainer,
            topLoser,
            distinctCount: symbols.size,
            avgPrice: totalValue / stocks.length
        };
    }, [stocks]);

    const StatCard = ({ title, value, color = '#fff', subValue }: { title: string, value: string, color?: string, subValue?: string }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={[styles.cardValue, { color }]}>{value}</Text>
            {subValue && <Text style={styles.cardSubValue}>{subValue}</Text>}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'Analytics' }} />

            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Portfolio Insights</Text>
            </View>

            {stats ? (
                <View style={styles.grid}>
                    <StatCard
                        title="Total Value"
                        value={`$${stats.totalValue.toFixed(2)}`}
                        color="#4cc9f0"
                    />
                    <StatCard
                        title="Avg. Price"
                        value={`$${stats.avgPrice.toFixed(2)}`}
                    />
                    <StatCard
                        title="Top Gainer"
                        value={stats.topGainer.symbol}
                        color="#4cc9f0"
                        subValue={`+${stats.topGainer.change_percent}%`}
                    />
                    <StatCard
                        title="Top Loser"
                        value={stats.topLoser.symbol}
                        color="#ff4d4f"
                        subValue={`${stats.topLoser.change_percent}%`}
                    />
                    <StatCard
                        title="Active Assets"
                        value={stats.distinctCount.toString()}
                    />
                    <StatCard
                        title="Data Points"
                        value={stocks.length.toString()}
                    />
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Add stocks to see analytics</Text>
                </View>
            )}

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>About This Data</Text>
                <Text style={styles.infoText}>
                    This data is stored locally on your device using classic SQLite.
                    When you add stocks in the "Stocks" tab, they are persisted to a .db file.
                    This Analytics screen aggregates that raw data in real-time.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    cardTitle: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardSubValue: {
        color: '#888',
        fontSize: 14,
        marginTop: 4,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    infoSection: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
    },
    infoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoText: {
        color: '#aaa',
        lineHeight: 22,
    }
});
