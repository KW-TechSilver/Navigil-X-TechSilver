module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            api: "./src/api",
            store: "./src/store",
            reducers: "./src/reducers",
            actions: "./src/actions",
            constants: "./src/constants",
            screens: "./src/screens",
            components: "./src/components",
            hooks: "./src/hooks",
            context: "./src/context",
            providers: "./src/providers",
            core: "./src/core",
            i18n: "./src/i18n",
            assets: "./src/assets",
            shared: "./src/shared",
            rafaelComponents: "./src/rafaelComponents",
          },
          extensions: [".js", ".jsx"],
        },
      ],
    ],
  };
};
