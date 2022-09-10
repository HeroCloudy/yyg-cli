#!/usr/bin/env node

const { program } = require('commander')
const logs = require('../utils/log-utils')
const createProject = require('../command/create')

logs.g('Thanks for using yyg cli !')

program.version(require('../package').version)
  .usage('<command> [arguments]')

program.command('create <projectName>')
  .description('create a new vite + vue3 project from yyg\'s template')
  .alias('c')
  .action((projectName) => {
    createProject(projectName)
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
