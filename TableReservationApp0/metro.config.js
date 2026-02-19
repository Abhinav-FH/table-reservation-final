const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Custom resolver to force axios to use the browser build instead of Node build
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'axios') {
    return {
      filePath: require.resolve('axios/dist/browser/axios.cjs'),
      type: 'sourceFile',
    };
  }
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
