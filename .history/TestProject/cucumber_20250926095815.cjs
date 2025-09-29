module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: [
      "features/support/world.ts",
      "features/support/hooks.ts",
      "features/step_definitions/*.ts",
    ],
    format: ["pretty"],
    paths: ["features/*.feature"],
  },
};
