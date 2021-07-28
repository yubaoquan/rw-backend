/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   * */
  exports = {};
  const config = exports;

  // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name}_1627378930589_5102`;

  // add your middleware config here
  config.middleware = ['errorHandler'];

  config.security = { csrf: { enable: false } };

  config.salt = 'asetaet';

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/realworld',
      options: { useUnifiedTopology: true },
      plugins: [],
    },
  };

  config.jwt = {
    jwtSecret: 'asetaet',
    jwtExpireTime: 60 * 60 * 8,
  };

  return { ...config };
};
