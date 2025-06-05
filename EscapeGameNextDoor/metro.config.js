const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const os = require('os');
const exclusionList = require('metro-config/src/defaults/exclusionList'); // Import exclusionList

// Environment detection
const isDev = process.env.NODE_ENV !== 'production';

// 1. Initialize base config with Expo defaults
const config = getDefaultConfig(__dirname, {
  resetCache: process.env.EXPO_RESET_CACHE === 'true'
});

// 2. NativeWind configuration (optimized)
const nativeWindConfig = {
  input: './global.css',
  projectRoot: __dirname,
  // NativeWind watch options are typically for its internal watchers,
  // Metro's main watcher config is more relevant for overall performance.
  // The global blockList/exclusionList should cover these.
};

// ========================
// 3. CORE OPTIMIZATIONS
// ========================
config.maxWorkers = 2;
// A. Worker Management
// Optimal workers are crucial. Too many can lead to EMFILE or context switching overhead.
// Too few can underutilize CPU. 1 or 2 less than CPU cores is often a good balance.

// You can also set a hard limit if experiencing issues: Math.min(config.maxWorkers, 6);

// B. Cache Configuration (with auto-cleanup)
const cacheDir = path.join(os.tmpdir(), 'metro-cache-expo'); // Use OS temp directory for cache
config.cacheStores = [
  new (require('metro-cache')).FileStore({
    root: cacheDir,
    // Aggressive GC in dev, less aggressive in prod
    gcInterval: isDev ? 1000 * 60 * 5 : 1000 * 60 * 60 * 24, // 5min dev, 24hr prod
    stabilityThreshold: 2000
  })
];

// C. Transformer Optimizations
config.transformer = {
  ...config.transformer,
  // inlineRequires is CRITICAL for performance in Metro. Keep this true.
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    // Only compress and mangle in production builds
    compress: !isDev,
    mangle: !isDev,
    keep_fnames: isDev,
    sourceMap: isDev
  },
  enableBabelRuntime: false // Reduces bundle size, good for speed
};

// D. Resolver Configuration
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  resolverMainFields: ['react-native', 'browser', 'main'],
  sourceExts: [...config.resolver.sourceExts, 'css', 'mjs', 'svg'],
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  // unstable_enableSymlinks is CRITICAL for Windows performance. Keep it false.
  unstable_enableSymlinks: false,
  unstable_enablePackageExports: true,
  // Use metro-config's exclusionList helper for robust regex merging
  blockList: exclusionList([
    // Core exclusions for build directories and node_modules within node_modules
    /.*\.test\.(js|ts|tsx)$/, // Exclude test files
    /.*__tests__\/.*/, // Exclude test directories
    /.*__fixtures__\/.*/,
    /\/android\/build\/.*/,
    /\/ios\/build\/.*/,
    /\.expo\/.*/,
    /node_modules\/.*\/node_modules\/.*/, // Prevents issues with hoisted modules
    // Add any specific large libraries you want to exclude from watching/bundling if not used in current target
    // For example: /node_modules\/some-large-library\/.*/
  ]),
  // Optimizing asset resolution path by adding project root
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'), // Explicitly resolve node_modules
  ]
};

// E. Watcher Configuration
config.watcher = {
  healthCheck: { enabled: true },
  // CHOKIDAR_USEPOLLING is a critical environment variable for Windows EMFILE issues.
  // When true, it uses polling (less efficient but more reliable) instead of native watchers.
  // Set this via an env var if you hit EMFILE. Otherwise, stick to native for speed.
  watchman: process.env.CHOKIDAR_USEPOLLING === 'true' ? false : true,
  interval: process.env.CHOKIDAR_USEPOLLING === 'true' ? 1000 : undefined, // Polling interval

};

// F. Server Configuration
config.server = {
  ...config.server,
  port: 8081,
  // Aggressive caching for node_modules in dev server, speeds up asset serving
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/node_modules')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      } else if (isDev && (req.url.endsWith('.js') || req.url.endsWith('.map'))) {
        res.setHeader('Cache-Control', 'no-cache'); // Ensure latest JS for development
      }
      return middleware(req, res, next);
    };
  },
  // Keep the Windows path fix
  rewriteRequestUrl: (url) => {
    return url.replace(/^\/[A-Z]:\//i, '/');
  }
};

// ========================
// 4. ERROR HANDLING & DEBUGGING
// ========================
const originalBuild = config.serializer?.customSerializer;
config.serializer.customSerializer = async (...args) => {
  try {
    if (originalBuild) {
      return await originalBuild(...args);
    }
    // Fallback to default serialization if no custom serializer exists
    const { fullBundle } = require('metro/src/DeltaBundler/Serializers');
    return fullBundle(...args);
  } catch (error) {
    // Enhanced error handling for common Metro issues
    if (error.message.includes('ENOENT')) {
      console.error('\n⚠️  Metro cache corruption detected. Run:');
      console.error('   npm run clean:metro\n');
    } else if (error.message.includes('EMFILE') || error.message.includes('ENFILE')) {
      console.error('\n⚠️  Too many open files. Try:');
      console.error('   - Setting `CHOKIDAR_USEPOLLING=true` in your environment variables.');
      console.error('   - Reducing `maxWorkers` further (e.g., to 2 or 1).\n');
    } else if (error.message.includes('Module not found')) {
      console.error('\n⚠️  Module resolution error. Try:');
      console.error('   npm run reset:metro\n');
    } else if (error.message.includes('EISDIR') || error.message.includes('EPERM')) {
      console.error('\n⚠️  Permission or directory access error. Try:');
      console.error('   - Running your terminal as Administrator.');
      console.error('   - Clearing Node.js caches (npm cache clean --force).\n');
    }
    throw error;
  }
};

// Debug logging for development
if (isDev && process.env.METRO_DEBUG) {
  console.log('🚀 Metro Config Loaded:');
  console.log(`   Workers: ${config.maxWorkers}`);
  console.log(`   Cache: ${cacheDir}`);
  console.log(`   Watchman: ${config.watcher.watchman}`);
  console.log(`   Use Polling: ${config.watcher.usePolling}`);
  console.log(`   Symlinks enabled: ${config.resolver.unstable_enableSymlinks}`);
}

// ========================
// 5. EXPORT CONFIG
// ========================
module.exports = withNativeWind(config, nativeWindConfig);