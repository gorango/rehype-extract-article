const fs = require('fs')
const path = require('path')
const test = require('tape')
const vfile = require('vfile')

const chae = require('../src')

test('Fixtures', function(t) {
  const root = path.join(__dirname, '../fixtures')

  fs.readdirSync(root)
    .forEach(function(fixture) {
      const input = path.join(root, fixture, 'input.html')
      const output = path.join(root, fixture, 'output.json')
      const file = vfile(fs.readFileSync(input))
      const actual = chae({ contents: file })
      let expected

      try {
        expected = JSON.parse(fs.readFileSync(output))
      } catch (error) {
        fs.writeFileSync(output, JSON.stringify(actual, null, 2) + '\n')
        return
      }

      t.deepEqual(actual, expected, 'should work on `' + fixture + '`')
    })

  t.end()
})
