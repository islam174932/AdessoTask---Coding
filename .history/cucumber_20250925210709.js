module.exports = {
  import: [
    'ts-node/register',
    './TestProject/features/step_definitions/regression.steps.ts',
    './TestProject/features/support/*.ts'
  ]
};
