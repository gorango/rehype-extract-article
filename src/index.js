const vfile = require('to-vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const stringify = require('rehype-stringify')
const inspect = require('unist-util-inspect')
const toString = require('hast-util-to-string')
const sanitize = require('hast-util-sanitize')
const toHtml = require('hast-util-to-html')

const extract = require('./extract-content')
const getMeta = require('./meta')

const summarySchema = {
  strip: ['h1', 'h2', 'figure', 'figcaption'],
  tagNames: ['p', 'blockquote']
}

module.exports = moduleExports

const defaultOptions = {
  meta: true,
  summary: true,
  body: true,
  html: true
}

function moduleExports (contents, options = defaultOptions) {
  if (!contents) {
    throw new Error('You need to supply a content String')
  }

  const file = vfile({ contents })
  const processor = unified()
    .use(parse)
    .use(stringify)
    .use(extract)

  const tree = processor.parse(file)
  const meta = getMeta(tree)
  const body = processor.runSync(tree, file)
  const html = toHtml(body)
  const summary = sanitize(body, summarySchema)
    .children.reduce((str, par) => `${str}${toString(par)}`, '')
    .slice(0, 280)

  const results = {
    meta,
    body,
    html,
    summary,
  }

  return Object.keys(options).reduce((obj, key) => ({
    ...obj,
    [key]: results[key]
  }), {})
}
