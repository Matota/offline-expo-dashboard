const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve 'react' and 'react-dom' from the project root.
// This prevents duplicate React instances when using symlinked modules or hoisted monorepos,
// which causes the "ReactSharedInternals" error.
config.resolver.extraNodeModules = {
    'react': path.resolve(__dirname, 'node_modules/react'),
    'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, 'node_modules'),
];

module.exports = config;
