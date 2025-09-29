module.exports = {
  default: [
    "--require-module ts-node/register",
    "--require features/**/*.ts",
    "--format @cucumber/pretty-formatter",
    "features/**/*.feature",
  ].join(" "),
};
