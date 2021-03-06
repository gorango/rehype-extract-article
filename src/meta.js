const {select, selectAll} = require('hast-util-select')
const toString = require('hast-util-to-string')
const sanitize = require('hast-util-sanitize')

const candidates = require('./meta.candidates')

const {
  TITLE_CANDIDATES,
  DATE_CANDIDATES,
  AUTHOR_CANDIDATES,
  PUBLISHER_CANDIDATES,
  DESCRIPTION_CANDIDATES,
  IMAGE_CANDIDATES,
  KEYWORDS_CANDIDATES,
  LANG_CANDIDATES,
  URL_CANDIDATES,
  COPYRIGHT_CANDIDATES
} = candidates

module.exports = function getMeta (tree) {
  const head = select('head', tree)

  return {
    title: getTitle(),
    date: getDate(),
    author: getAuthor(),
    publisher: getPublisher(),
    description: getDescription(),
    image: getImage(),
    keywords: getKeywords(),
    lang: getLang(),
    url: getUrl(),
  }

  function getTitle () {
    const stringify = (selector, node) => toString(select(selector, node))

    const metaTitle = selectAll('meta', head)
      .find(({ properties: { property: p, name: n } }) => p && p === 'og:title' || n === 'title' )

    const candidate = metaTitle && metaTitle.hasOwnProperty('properties')
      ? metaTitle.properties.content
      : stringify('title', head) || stringify('h1', tree)

    const titleDelimiters = [' | ', ' – ', ' - ', ' » ', ' : ']
    return titleDelimiters.reduce((found, d) => {
      if (!found.includes(d)) {
        return found
      }
      return found.split(d).reverse().slice(1).reverse().join(d)
    }, candidate)
  }

  function getDate () {
    return DATE_CANDIDATES.reduce((found, candidate) => {
      if (found) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return null
      }
      const { properties: { content, attr } } = node
      if (content) {
        return content
      }
      if (attr) {
        return attr
      }
      return toString(node)
    }, null)
  }

  function getAuthor () {
    return AUTHOR_CANDIDATES.reduce((found, candidate) => {
      const { type, tag } = candidate
      if (found || type !== 'name') {
        return found
      }
      const node = select(tag, tree)
      if (!node) {
        return null
      }
      const { properties: { content } } = node
      if (content && content.length) {
        return content
      }
    }, null)
  }

  function getPublisher () {
    return PUBLISHER_CANDIDATES.reduce((found, candidate) => {
      const { type, tag } = candidate
      if (found || type !== 'og') {
        return found
      }
      const node = select(tag, tree)
      if (!node) {
        return null
      }
      const { properties: { content } } = node
      if (content && content.length) {
        return content
      }
    }, null)
  }

  function getDescription () {
    return DESCRIPTION_CANDIDATES.reduce((found, candidate) => {
      if (found) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return null
      }
      const { properties: { content } } = node
      if (content) {
        return content
      }
      return toString(node)
    }, null)
  }

  function getImage () {
    return IMAGE_CANDIDATES.reduce((found, candidate) => {
      if (found) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return null
      }
      const { properties: { content } } = node
      if (content) {
        return content
      }
      return toString(node)
    }, null)
  }

  function getKeywords () {
    return KEYWORDS_CANDIDATES.reduce((found, candidate) => {
      if (found.length) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return []
      }
      const { properties: { content } } = node
      if (content) {
        return content.split(',').map(w => w.trim())
      }
      return []
    }, [])
  }

  function getLang () {
    const { properties } = select('html', tree)
    return properties.hasOwnProperty('lang')
      ? properties.lang
      : head.children && head.children.reduce((found, { name, content, 'http-equiv': http }) => {
        if (found) {
          return found
        }
        if (name === 'lang') {
          return content
        }
        if (http === 'content-language') {
          return content
        }
        return found
      }, null)
  }

  function getUrl () {
    return URL_CANDIDATES.reduce((found, { tag, attr }) => {
      if (found) {
        return found
      }
      const node = select(tag, head)
      if (!node) {
        return null
      }
      const prop = node.properties[attr]
      if (prop) {
        return prop
      }
      return null
    }, null)
  }
}
