module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require features/step_definitions/smoke.steps.ts',
    '--format @cucumber/pretty-formatter',
    'features/smoke.feature'
  ].join(' '),
};
