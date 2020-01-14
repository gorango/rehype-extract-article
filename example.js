const fs = require('fs')
const pug = require('pug')
const toHtml = require('hast-util-to-html')
const inspect = require('unist-util-inspect')
const pretty = require('pretty')

const chae = require('./src')

const fixtures = [
  'input.pug',
  'rl/ahelwer.pug',          // 1
  'rl/elemental.medium.pug', // 2
  'rl/gen.medium.pug',       // 3
  'rl/github.pug',           // 4
  'rl/plain-w-comments.pug', // 5
  'rl/smashingmag.pug',      // 6
  'rl/snyk.pug',             // 7
  'rl/some-wordpress.pug',   // 8
  'rl/techcrunch.pug',       // 9
  'rl/thenextweb.pug',       // 10
]

const path = `fixtures/${fixtures[2]}`
const contents = pug.renderFile(path)

const result = chae({ path, contents })
console.log(inspect(result.body))

// Write to file...
const output = pretty(toHtml(result.body))
fs.writeFileSync('output.html', output)
