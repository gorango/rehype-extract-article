const fs = require('fs')
const pug = require('pug')
const toHtml = require('hast-util-to-html')
const inspect = require('unist-util-inspect')
const pretty = require('pretty')

const extract = require('../src')

const fixtures = [
  'components/input.pug',
  'real-world/ahelwer.pug',          // 1
  'real-world/elemental.medium.pug', // 2
  'real-world/gen.medium.pug',       // 3
  'real-world/github.pug',           // 4
  'real-world/plain-w-comments.pug', // 5
  'real-world/smashingmag.pug',      // 6
  'real-world/snyk.pug',             // 7
  'real-world/some-wordpress.pug',   // 8
  'real-world/techcrunch.pug',       // 9
  'real-world/thenextweb.pug',       // 10
]

const path = `sandbox/${fixtures[2]}`
const contents = pug.renderFile(path)

const result = extract({ path, contents })
const { meta, summary, body } = result

console.log(inspect(body))

const prettyHtml = pretty(toHtml(body))
