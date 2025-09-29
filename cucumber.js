module.exports = {
  require: [
    "TestProject/features/step_definitions/regression.steps.ts",
    "TestProject/features/support/hooks.ts",
    "TestProject/features/support/world.ts",
  ],
  requireModule: ["ts-node/register"],
};
