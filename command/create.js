const inquirer = require('inquirer')
const fs = require('fs')
const logs = require('../utils/log-utils')

const TYPE_PROJECT = 'project'
const TYPE_LIBRARY = 'library'

const createQuestions = [
  {
    type: 'list',
    name: 'projectType',
    message: 'Please choose the project type?',
    choices: [
      {
        key: TYPE_PROJECT,
        name: 'Vue3 全家桶项目（vite3 + vue3 + typescript + vue router + pinia）',
        value: TYPE_PROJECT
      },
      {
        key: 'library', // key 必须是单个小写的字符
        name: 'Vue3 组件库项目（vite3 + vue3 + typescript + cli + vitepress）',
        value: TYPE_LIBRARY
      }
    ]
  }
]

const create = (projectName) => {
  if (fs.existsSync(projectName)) {
    logs.r('The project has exist')
    return
  }
  inquirer.prompt(createQuestions).then(({ projectType }) => {
    console.log(projectType)
    if (projectType === TYPE_PROJECT) {
      const createProject = require('./create-project')
      createProject(projectName)
    } else if (projectType === TYPE_LIBRARY) {
      const createLibrary = require('./create-library')
      createLibrary(projectName)
    }
  })
}

module.exports = create
