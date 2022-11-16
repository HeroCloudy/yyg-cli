const inquirer = require('inquirer')
const fs = require('fs')
const os = require('os')
const logs = require('../utils/log-utils')
const ora = require('ora')
const shelljs = require('shelljs')
const download = require('download-git-repo')
const writeFile = require('../utils/file-utils')
const path = require('path')

const git = 'HeroCloudy/vue3-component-library-archetype#template'

const createQuestions = [
  {
    name: 'componentPrefix',
    message: '请输入组件名的前缀（如 el）',
    default: 'demo'
  },
  {
    name: 'description',
    message: '请输入组件库中文描述',
    default: 'Vue3 企业级组件库'
  },
  {
    name: 'author',
    message: 'Input the project author: ',
    default: os.userInfo().username
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

    const shellCommand = `cd ${projectName} && pnpm install`
    installDependence(shellCommand)
  })
}

const convertFirstUpper = (str) => {
  return `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`
}

const getCamelName = (componentName) => {
  let ret = ''
  const list = componentName.split('-')
  list.forEach(item => {
    ret += convertFirstUpper(item)
  })
  return ret
}

const renameDirectory = (fileName, newFileName) => {
  if (fs.existsSync(fileName)) {
    fs.renameSync(fileName, newFileName)
  }
}

const createSuccessCallback = (spinner, projectName, componentPrefix, description, author) => {
  const data = {
    libraryName: projectName,
    libraryNameCamel: getCamelName(projectName),
    description,
    author,
    componentPrefix
  }
  writeFile(`${projectName}/README.md`, data)
  writeFile(`${projectName}/package.json`, data)
  writeFile(`${projectName}/cli/package.json`, data)
  // writeFile(`${projectName}/cli/src/command/create-component.js`, data)
  // writeFile(`${projectName}/cli/src/util/name-utils.ts`, data)
  writeFile(`${projectName}/cli/src/config.ts`, data)
  writeFile(`${projectName}/docs/.vitepress/theme/index.ts`, data)
  writeFile(`${projectName}/docs/.vitepress/config.ts`, data)
  writeFile(`${projectName}/docs/guide/index.md`, data)
  writeFile(`${projectName}/docs/index.md`, data)
  writeFile(`${projectName}/docs/demos/foo/foo-2.vue`, data)
  writeFile(`${projectName}/docs/package.json`, data)
  writeFile(`${projectName}/example/src/App.vue`, data)
  writeFile(`${projectName}/example/src/main.ts`, data)
  writeFile(`${projectName}/example/package.json`, data)
  writeFile(`${projectName}/packages/foo/package.json`, data)
  writeFile(`${projectName}/packages/foo/src/index.tsx`, data)
  writeFile(`${projectName}/packages/scss/components/_foo.scss`, data)
  writeFile(`${projectName}/packages/utils/package.json`, data)

  const oldLibName = path.join(__dirname, `${projectName}/packages/demo-ui-lib`)
  const newLibName = oldLibName.replace('demo-ui-lib', projectName)
  console.log(process.cwd())
  console.log(newLibName)
  renameDirectory(`${projectName}/packages/demo-ui-lib`, `${projectName}/packages/${projectName}`)
  writeFile(`${projectName}/packages/${projectName}/index.ts`, data)
  writeFile(`${projectName}/packages/${projectName}/package.json`, data)
  writeFile(`${projectName}/packages/${projectName}/vite.config.ts`, data)

  spinner.succeed()
  logs.g('Component Library has created successfully!')

  promptInstall(projectName)
}

const createLibrary = (projectName) => {
  if (fs.existsSync(projectName)) {
    logs.r('The project has exist')
    return
  }
  inquirer.prompt(createQuestions).then(({ componentPrefix, description, author }) => {
    console.log(componentPrefix, author)
    const spinner = ora('Generating, please wait...').start()

    download(git, projectName, {}, (err) => {
      if (err) {
        spinner.fail()
        logs.r(err)
      } else {
        createSuccessCallback(spinner, projectName, componentPrefix, description, author)
      }
    })
  })
}

module.exports = createLibrary
