const vfile = require('to-vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const stringify = require('rehype-stringify')
const inspect = require('unist-util-inspect')
const toString = require('hast-util-to-string')
const sanitize = require('hast-util-sanitize')

const extract = require('./extract-content')
const getMeta = require('./meta')

const summarySchema = {
  strip: ['h1', 'h2', 'figure', 'figcaption'],
  tagNames: ['p', 'blockquote']
}

module.exports = chae

function chae (contents) {
  const file = vfile(contents)

  const processor = unified()
    .use(parse)
    .use(stringify)
    .use(extract)

  const tree = processor.parse(file)
  const body = processor.runSync(tree, file)
  const meta = getMeta(tree)

  const summary = sanitize(body, summarySchema)
    .children.reduce((str, par) => `${str}${toString(par)}`, '')
    .slice(0, 280)

  return { meta, summary, body }
}
