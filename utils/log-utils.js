const chalk = require('chalk')
const logSymbols = require('log-symbols')

function r (msg, showIcon) {
  if (showIcon) {
    console.log(logSymbols.error, chalk.red(msg))
  } else {
    console.log(chalk.red(msg))
  }
}

function g (msg, showIcon = true) {
  if (showIcon) {
    console.log(logSymbols.success, chalk.green(msg))
  } else {
    console.log(chalk.green(msg))
  }
}

module.exports = {
  r,
  g
}
