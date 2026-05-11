const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Fix for lodash/isEmpty issues in react-native-calendars
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'lodash/isEmpty': require.resolve('lodash/isEmpty'),
};

module.exports = withNativeWind(config, { input: './global.css' });
