import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStore } from '../../store/useStore';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryScatter } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
    const { stocks, syncWithCloud, isSyncing, lastSynced } = useStore();

    // Process data to find the most frequent symbol to chart
    const charData = useMemo(() => {
        if (stocks.length === 0) return [];

        // Group by symbol
        const grouped: Record<string, typeof stocks> = {};
        stocks.forEach(s => {
            if (!grouped[s.symbol]) grouped[s.symbol] = [];
            grouped[s.symbol].push(s);
        });

        // Find symbol with most data points
        let topSymbol = Object.keys(grouped)[0];
        let maxCount = 0;
        Object.keys(grouped).forEach(key => {
            if (grouped[key].length > maxCount) {
                maxCount = grouped[key].length;
                topSymbol = key;
            }
        });

        // Sort by timestamp
        return grouped[topSymbol].sort((a, b) => a.timestamp - b.timestamp).map(s => ({
            x: new Date(s.timestamp),
            y: s.price,
            symbol: s.symbol
        }));
    }, [stocks]);

    const activeSymbol = charData.length > 0 ? charData[0].symbol : '---';
    const currentPrice = charData.length > 0 ? charData[charData.length - 1].y : 0;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.greeting}>Portfolio Overview</Text>
                    <TouchableOpacity
                        onPress={syncWithCloud}
                        disabled={isSyncing}
                        style={styles.syncButton}
                    >
                        {isSyncing ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Text style={styles.syncButtonText}>Sync</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <Text style={styles.subtext}>Offline-First Financial Data</Text>
                {lastSynced && (
                    <Text style={styles.lastSynced}>
                        Last Synced: {lastSynced.toLocaleTimeString()}
                    </Text>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{activeSymbol} Performance</Text>
                <Text style={styles.bigPrice}>${currentPrice.toFixed(2)}</Text>

                {charData.length > 1 ? (
                    <View pointerEvents="none">
                        <VictoryChart
                            width={screenWidth - 60}
                            height={250}
                            theme={VictoryTheme.material}
                            domainPadding={20}
                        >
                            <VictoryAxis
                                tickFormat={(x) => new Date(x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                style={{
                                    axis: { stroke: "#555" },
                                    tickLabels: { fill: "#888", fontSize: 10, padding: 5 }
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                style={{
                                    axis: { stroke: "#555" },
                                    tickLabels: { fill: "#888", fontSize: 10, padding: 5 }
                                }}
                            />
                            <VictoryLine
                                data={charData}
                                style={{
                                    data: { stroke: "#4cc9f0", strokeWidth: 3 }
                                }}
                                animate={{
                                    duration: 500,
                                    onLoad: { duration: 500 }
                                }}
                            />
                            <VictoryScatter
                                data={charData}
                                size={4}
                                style={{ data: { fill: "#fff" } }}
                            />
                        </VictoryChart>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>
                            Add multiple entries for the same stock symbol to see a trend chart.
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Entries</Text>
                    <Text style={styles.statValue}>{stocks.length}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Unique Assets</Text>
                    <Text style={styles.statValue}>{new Set(stocks.map(s => s.symbol)).size}</Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    syncButton: {
        backgroundColor: '#4cc9f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    syncButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    subtext: {
        color: '#888',
        fontSize: 16,
    },
    lastSynced: {
        color: '#4cc9f0',
        fontSize: 12,
        marginTop: 4,
    },
    card: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cardTitle: {
        color: '#888',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    bigPrice: {
        color: '#4cc9f0',
        fontSize: 36,
        fontWeight: '900',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 20,
        width: '48%',
    },
    statLabel: {
        color: '#888',
        fontSize: 14,
    },
    statValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
    },
    placeholder: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    placeholderText: {
        color: '#666',
        textAlign: 'center'
    }
});
