// Learn more https://docs.expo.io/guides/customizing-metro
const { Input } = require('@mui/material');
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

//cache systéme
config.maxWorkers = 2;
config.watchFolders=[__dirname];
config.transformer.assetPlugins=config.transformer.assetPlugins||[];
config.transformer.getTransformOptions= async()=> ({
    transform:{
        experimentalImportSupport:false,
        inlineRequires:false
    }
});

config.cacheStores = config.cacheStores||[];
config.cacheVersion= "1.0";

module.exports = withNativeWind(config , {
    input:'./global.css',
});
