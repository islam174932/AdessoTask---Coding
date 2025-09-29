module.exports = {
  default: [
    "--import features/support/world.ts",
    "--import features/support/hooks.ts",
    "--import features/step_definitions/*.ts",
    "--import features/smoke/step_definitions/*.ts",
    "--format @cucumber/pretty-formatter",
    "features/**/*.feature",
    "--loader ts-node/esm",
  ].join(" "),
};
