const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@lingui/conf' || moduleName.startsWith('@lingui/conf/')) {
    return {
      type: 'empty',
    };
  }

  const nodeModules = ['path', 'fs', 'chalk', 'jest-validate', 'cosmiconfig'];
  if (nodeModules.includes(moduleName)) {
    return {
      type: 'empty',
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
