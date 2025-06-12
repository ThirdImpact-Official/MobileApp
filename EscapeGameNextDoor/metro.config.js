const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, { isCSSEnabled: false });

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts], // pas d'ajout si inutile
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
};

config.transformer = {
  ...config.transformer,
  // pas de minification lourde en dev
};

module.exports = withNativeWind(config, {
  input: './global.css',
  projectRoot: __dirname,
  disableRerun: true,
});
