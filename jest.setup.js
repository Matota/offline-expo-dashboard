// Mock the native Expo SQLite module
jest.mock('expo-sqlite', () => ({
    openDatabaseAsync: jest.fn(() => Promise.resolve({
        execAsync: jest.fn(() => Promise.resolve()),
        runAsync: jest.fn(() => Promise.resolve()),
        getAllAsync: jest.fn(() => Promise.resolve([])),
        transaction: jest.fn()
    })),
    openDatabase: jest.fn(() => ({
        transaction: jest.fn()
    }))
}));

// Mock Victory Native modules (Canvas based)
jest.mock('victory-native', () => ({
    VictoryChart: 'VictoryChart',
    VictoryLine: 'VictoryLine',
    VictoryScatter: 'VictoryScatter',
    VictoryTheme: { material: {} },
    VictoryAxis: 'VictoryAxis'
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});
global.ReanimatedDataMock = {
    now: () => 0,
};
