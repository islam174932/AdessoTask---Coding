module.exports = {
  default:
    "--require-module ts-node/register --require features/support/world.ts --require features/support/hooks.ts --require features/step_definitions/*.ts",
};
