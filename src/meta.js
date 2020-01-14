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
  const raw = select('head', tree)
  const head = sanitize(raw, {
    strip: ['script', 'style', 'link']
  })

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
      : stringify('h1', tree) || stringify('title', head)

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
      if (found.length) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return ''
      }
      const {properties: {content, attr}} = node
      if (content) {
        return content
      }
      if (attr) {
        return attr
      }
      return toString(node)
    }, '')
  }

  function getAuthor () {
    return AUTHOR_CANDIDATES.reduce((obj, {type, tag}) => {
      const node = select(tag, tree)
      if (!node) return obj
      const {properties: {content}} = node
      if (content && content.length) {
        return {...obj, [type]: content}
      }
      const text = toString(node)
      if (text && text.length) {
        return {...obj, [type]: cleanText(text)}
      }
      return obj
    }, {})
  }

  function getPublisher () {
    return PUBLISHER_CANDIDATES.reduce((obj, {type, tag}) => {
      const node = select(tag, tree)
      if (!node) {
        return obj
      }
      const {properties: {content}} = node
      if (content && content.length) {
        return {...obj, [type]: content}
      }
      const text = toString(node)
      if (text && text.length) {
        return {...obj, [type]: cleanText(text)}
      }
      return obj
    }, {})
  }

  function getDescription () {
    return DESCRIPTION_CANDIDATES.reduce((found, candidate) => {
      if (found.length) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return ''
      }
      const {properties: {content}} = node
      if (content) {
        return content
      }
      return toString(node)
    }, '')
  }

  function getImage () {
    return IMAGE_CANDIDATES.reduce((found, candidate) => {
      if (found.length) {
        return found
      }
      const node = select(candidate, tree)
      if (!node) {
        return ''
      }
      const {properties: {content}} = node
      if (content) {
        return content
      }
      return toString(node)
    }, '')
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
      const {properties: {content}} = node
      if (content) {
        return content.split(',').map(w => w.trim())
      }
      return []
    }, [])
  }

  function getLang () {
    const {properties} = select('html', tree)
    return properties.hasOwnProperty('lang')
      ? properties.lang
      : head.children && head.children.reduce((found, {name, content, 'http-equiv': h}) => {
        if (found.length) {
          return found
        }
        if (name === 'lang') {
          return content
        }
        if (h === 'content-language') {
          return content
        }
        return found
      }, '')
  }

  function getUrl () {
    return URL_CANDIDATES.reduce((found, {tag, attr}) => {
      if (found.length) {
        return found
      }
      const node = select(tag, head)
      if (!node) {
        return ''
      }
      const v = node.properties[attr]
      if (v) {
        return v
      }
      return ''
    }, '')
  }
}
