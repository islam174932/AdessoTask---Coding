module.exports = {
  require: [
    "./TestProject/features/step_definitions/*.ts",
    "./TestProject/features/support/*.ts",
  ],
  requireModule: ["ts-node/register"],
};
