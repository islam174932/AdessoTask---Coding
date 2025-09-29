module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["features/support/world.ts", "features/support/hooks.ts"],
    formatOptions: {
      snippetInterface: "async-await",
    },
  },
};
