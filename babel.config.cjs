module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'babel-plugin-macros',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@modules': './src/modules',
            '@lib': './src/lib',
            '@store': './src/store',
            '@shared': './src/shared',
            '@app': './src/app',
            '@locale': './src/locale',
            '@src': './src',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  };
};
