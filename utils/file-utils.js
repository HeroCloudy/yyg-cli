const fs = require('fs')
const handlebars = require('handlebars')

const writeFile = (fileName, data) => {
  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName).toString()
    const result = handlebars.compile(content)(data)
    fs.writeFileSync(fileName, result)
  }
}

module.exports = writeFile
