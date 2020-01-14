const test = require('tape')
const fs = require('fs')
const pug = require('pug')
const toHtml = require('hast-util-to-html')
const pretty = require('pretty')

const chae = require('../src')

const fixtures = [
  'input.pug',
  'rl/ahelwer.pug',
  'rl/elemental.medium.pug',
  'rl/gen.medium.pug',
  'rl/github.pug',
  'rl/plain-w-comments.pug',
  'rl/smashingmag.pug',
  'rl/snyk.pug',
  'rl/some-wordpress.pug',
  'rl/techcrunch.pug',
  'rl/thenextweb.pug',
]

test('Real world articles', t => {
  for (const fixture of fixtures) {
    const path = `fixtures/${fixture}`
    const contents = pug.renderFile(path)
    const result = chae({ path, contents })

    const actual = Object.keys(result)
    const expected = ['meta', 'summary', 'body']

    t.deepEqual(actual, expected)
  }

  t.end()
})
