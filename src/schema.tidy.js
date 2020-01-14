const initSchema = require('./schema.init')

const { ancestors, protocols, attributes, tagNames: tags } = initSchema

const tagNames = tags.slice(3) // exclude first tags: section, div, span

module.exports = {
  strip: ['head'],
  ancestors,
  protocols,
  attributes,
  tagNames
}