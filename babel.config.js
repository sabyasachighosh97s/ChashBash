module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@screens': './src/screens',
          '@data': './src/data',
          '@types': './src/types',
          '@utils': './src/utils',
          '@services': './src/services',
          '@navigation': './src/navigation',
          '@themes': './src/themes',
        },
      },
    ],
     'react-native-reanimated/plugin',
  ],
};