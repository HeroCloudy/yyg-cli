const inquirer = require('inquirer')
const fs = require('fs')
const os = require('os')
const logs = require('../utils/log-utils')
const ora = require('ora')
const shelljs = require('shelljs')
const download = require('download-git-repo')
const writeFile = require('../utils/file-utils')

// const git = 'HeroCloudy/vue3-vite-archetype#template'
const git = 'https://gitee.com/yygnb/vue3-vite-archetype.git'

const createQuestions = [
  {
    name: 'description',
    message: 'Input the project description: ',
    default: 'vite vue3 project'
  },
  {
    name: 'version',
    message: 'Input the project version: ',
    default: '1.0.0'
  },
  {
    name: 'author',
    message: 'Input the project author: ',
    default: os.userInfo().username
  },
  {
    name: 'port',
    message: 'Input the dev server port: ',
    default: 3000
  }
]

const installDependence = (shellCommand) => {
  const spinner = ora('Installing dependence..').start()

  shelljs.exec(shellCommand, (err, stdout, stderr) => {
    console.log(stdout)
    if (err) {
      spinner.fail()
      logs.r(err)
    } else {
      spinner.succeed()
      logs.g('Dependencies installed successfully!')
    }
  })
}

const promptInstall = (projectName) => {
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'isInstall',
      message: 'Are you want to install dependence right now ? ',
      default: true
    }
  ]).then(({ isInstall }) => {
    console.log(isInstall)
    if (!isInstall) {
      logs.g('You should install the dependence by yourself!')
      return
    }

    inquirer.prompt([
      {
        type: 'list',
        name: 'installType',
        message: 'Choose the install type: ',
        choices: [
          'pnpm', 'npm', 'cnpm', 'yarn'
        ]
      }
    ]).then(({ installType }) => {
      const shellCommand = `cd ${projectName} && ${installType} install`
      installDependence(shellCommand)
    })
  })
}

const createSuccessCallback = (spinner, projectName, version, description, author, port) => {
//   // 写 package.json 文件
  writeFile(`${projectName}/package.json`, {
    projectName,
    description,
    version,
    author
  })

  writeFile(`${projectName}/README.md`, {
    projectName,
    description
  })

  // 写 vite.config.ts 文件
  writeFile(`${projectName}/vite.config.ts`, { port })

  spinner.succeed()
  logs.g('Project has created successfully!')

  promptInstall(projectName)
}

const createProject = (projectName) => {
  if (fs.existsSync(projectName)) {
    logs.r('The project has exist')
    return
  }
  inquirer.prompt(createQuestions).then(({ description, version, author, port }) => {
    console.log(description, version, author, port)
    const spinner = ora('Generating, please wait...').start()

    download(git, projectName, {}, (err) => {
      if (err) {
        spinner.fail()
        logs.r(err)
      } else {
        createSuccessCallback(spinner, projectName, version, description, author, port)
      }
    })
  })
}

module.exports = createProject
