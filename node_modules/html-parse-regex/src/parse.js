import { ifThrow, isString, isArray, isObject } from 'pytils'
import { getHash } from 'dejavu-call'
import { tagCatcher } from './regex'
import { error, resetError, isLostCloseTag } from './error'
import { _tryPushNode, oneMapToFilter, _findOpen, _linkNodes, _pushList, createShortcutAndAttributes, createPureTextNode, createRoot } from './utils'

const getAllTags = html => {
  const Nodes = []
  const tryPushNode = _tryPushNode(tagCatcher, Nodes)
  let match
  while (match = tagCatcher.exec(html)) {
    tryPushNode(match)
  }
  return Nodes
}

const addAllPureTexts = (Nodes, html) => {
  let fullNodes = [], before = 0, text = ''
  Nodes
    .concat({ start: html.length })
    .map(node => {
      const len = node.start -before
      text = html.substr(before, len)
      if (text) {
        fullNodes.push(
          createPureTextNode(text, before, node.start))
      }
      before = node.end
      fullNodes.push(node)
    })
  fullNodes.pop()
  return fullNodes
}

const mountTree = (pushList, Nodes) => {
  let kOpen
  const { closes, noCloses } = oneMapToFilter(Nodes)
  const findOpen = _findOpen(noCloses)
  const linkNodes = _linkNodes(pushList, closes, noCloses)
  closes.map(
    (n, kClose) => {
      kOpen = findOpen(n.tag, kClose)
      if (kOpen !== false) {
        linkNodes(kOpen, kClose)
      } else {
        isLostCloseTag(closes[kClose])
      }
    }
  )
  return createRoot(pushList, noCloses)
}

const parse = html => {
  if (html === undefined) { throw 'param "html" is undefined' }
  if (typeof html !== 'string') { throw 'param "html" is undefined' }

  resetError()
  const list = []
  const pushList = _pushList(list)
  const tree = mountTree(
    pushList,
    addAllPureTexts(
      getAllTags(html),
      html))
  return {
    hash: getHash(html),
    file: html,
    list: list,
    tree: tree,
    shortcut: createShortcutAndAttributes(list),
    error
  }
}

export const htmlValidator = moduleName => html => {
  const erro = `${moduleName}: html is a essential! and need to be a valid html object`
  ifThrow(
    !isObject(html),
    erro)
  
  ifThrow(
    !isString(html.hash),
    erro)
  ifThrow(
    !isString(html.file),
    erro)
  ifThrow(
    !isArray(html.list),
    erro)
  ifThrow(
    !isObject(html.tree),
    erro)
  ifThrow(
    !isObject(html.shortcut),
    erro)
  ifThrow(
    !isObject(html.error),
    erro)
  
  ifThrow(
    html.tree.root !== true,
    erro)
  ifThrow(
    !isObject(html.tree.link),
    erro)
}

export default parse
