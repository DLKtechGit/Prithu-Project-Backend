const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// module.exports = async function (env, argv) {
//     const config = await createExpoWebpackConfigAsync(env, argv);

//     config.resolve.fallback = {
//         ...config.resolve.fallback,
//         crypto: require.resolve('expo-crypto'),
//     };
//     return config;
// };

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);
    // Customize the config before returning it.
    // Resolve relative reference ../Utilities/Platform as react-native-web
    config.resolve.alias['../Utilities/Platform'] = 'react-native-web/dist/exports/Platform';
    return config;
  };