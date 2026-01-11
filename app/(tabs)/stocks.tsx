import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore } from '../../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function StocksScreen() {
    const { stocks, addNewStock, removeStock, isLoading } = useStore();
    const [symbol, setSymbol] = useState('');
    const [price, setPrice] = useState('');
    const [change, setChange] = useState('');

    const handleAdd = async () => {
        if (!symbol || !price) return;
        await addNewStock(symbol.toUpperCase(), parseFloat(price), parseFloat(change || '0'));
        setSymbol('');
        setPrice('');
        setChange('');
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.stockItem}>
            <View>
                <Text style={styles.stockSymbol}>{item.symbol}</Text>
                <Text style={styles.stockDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.stockPrice}>${item.price.toFixed(2)}</Text>
                    <Text style={[styles.stockChange, { color: item.change_percent >= 0 ? '#4cc9f0' : '#ff4d4f' }]}>
                        {item.change_percent >= 0 ? '+' : ''}{item.change_percent}%
                    </Text>
                </View>
                <TouchableOpacity onPress={() => removeStock(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Symbol (e.g. AAPL)"
                    placeholderTextColor="#666"
                    value={symbol}
                    onChangeText={setSymbol}
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                        placeholder="Price"
                        placeholderTextColor="#666"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Change %"
                        placeholderTextColor="#666"
                        value={change}
                        onChangeText={setChange}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={isLoading}>
                    <Text style={styles.addButtonText}>{isLoading ? 'Adding...' : 'Add Stock'}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={stocks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No stocks in portfolio</Text>}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    form: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: '#4cc9f0',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        paddingBottom: 20,
    },
    stockItem: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stockSymbol: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    stockDate: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceContainer: {
        alignItems: 'flex-end',
        marginRight: 16,
    },
    stockPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stockChange: {
        fontSize: 14,
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
    },
});
