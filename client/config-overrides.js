// client/config-overrides.js
module.exports = {
  // לא משנות את קונפיג ה-webpack עצמו
  webpack: function (config, env) {
    return config;
  },

  // משנות את קונפיג devServer כדי למנוע את השגיאה של allowedHosts
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.allowedHosts = 'all'; // <-- הפוך את זה ל"all" במקום מערך ריק
      return config;
    };
  },
};
