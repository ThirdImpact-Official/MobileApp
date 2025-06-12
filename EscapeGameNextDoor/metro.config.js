const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Get the default config with CSS support
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Platform-aware configuration
const isWeb = process.env.RN_TARGET === 'web' || process.env.EXPO_PUBLIC_TARGET === 'web';

// Resolver configuration
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...(isWeb ? {
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
    } : {}),
    'expo': path.resolve(__dirname, 'node_modules/expo'),
    'expo-router': path.resolve(__dirname, 'node_modules/expo-router'),
    '@expo/metro-runtime': path.resolve(__dirname, 'node_modules/@expo/metro-runtime'),
    'react-native-web': path.resolve(__dirname, 'node_modules/react-native-web'),
  },
  sourceExts: [...config.resolver.sourceExts, 'cjs', 'mjs'],
  resolverMainFields: isWeb 
    ? ['browser', 'module', 'main'] 
    : ['react-native', 'browser', 'main'],
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  // Only apply web aliases when targeting web
  alias: isWeb ? {
    '^react-native$': 'react-native-web',
    '^@expo/vector-icons$': 'react-native-vector-icons',
  } : {},
};

// Transformer configuration
config.transformer = {
  ...config.transformer,
  // Only apply web-specific minifier config when targeting web
  ...(isWeb ? {
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
    },
  } : {}),
};

// Server configuration with SSR protection
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Block server-side access to browser-specific modules
      if (!isWeb && req.url.match(/react-native-web|dom/)) {
        res.statusCode = 404;
        res.end();
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, {
  input: './global.css',
  projectRoot: __dirname,
});