import { path, isString } from 'pytils'
import { paramCatcher } from './regex'
import { isForcedCloseTag } from './error'

export const _tryPushNode = (Pattern, Nodes) => match => {
  const tag = match[2] !== undefined ? match[2] : ''
  if (tag) {
    const node = {
        tag: tag,
      attrs: match[3] !== undefined ? match[3] : '',
      start: match.index,
        end: Pattern.lastIndex
    }
    match[4] !== undefined
      ? ( node.linked = true )
      : ( match[1] !== undefined
            ? node.close = true
            : node.open = true )
    Nodes.push(node)
  }
}

export const oneMapToFilter = Nodes => {
  let closes = [], noCloses = []
  Nodes.map(
    (n, k) => n.close
      ? closes[k] = n
      : noCloses[k] = n)
  return { closes, noCloses }
}

export const _findOpen = noCloses => (tag, key) => {
  let node
  for (let kOpen = key; kOpen >= 0; kOpen--) {
    node = noCloses[kOpen]
    if (node && node.open && node.tag === tag) {
      return kOpen
    }
  }
  return false
}

const createNode = (openNode, closeNode) => {
  isForcedCloseTag(openNode, closeNode)
  delete openNode.open
  delete openNode.linked
  closeNode && (openNode.end = closeNode.end)
  openNode.link = {
    father: null,
    childs: []
  }
  return openNode
}

const _forceCreateNode = (pushList, father) => child => {
  if (child) {
    if (typeof child === 'object') {
      if (!child.text && !child.link) {
        child = createNode(child)
      }
      child.link.father = father
    }
    father.link.childs.push(child)
    pushList(child)
  }
}

export const _linkNodes = (pushList, closes, noCloses) => (kOpen, kClose) => {
  const father = createNode(noCloses[kOpen], closes[kClose])
  const forceCreateNode = _forceCreateNode(pushList, father)
  for (let key = kOpen +1; key <= kClose; key++) {
    forceCreateNode(noCloses[key])
    delete noCloses[key]
    delete closes[key]
  }
  noCloses[kOpen] = father
}

export const _pushList = list => node => list.push(node)

const getTagParams = _params => {
  const params = {}
  let match
  while (match = paramCatcher.exec(_params)) {
    const key = match[1]
    const value = match[2] ? match[2] : true
    if (key) {
      params[key] = value
    }
  }
  return params
}

export const createShortcutAndAttributes = list => {
  const id = {}
  list.map(
    (n, k) => {
      n.uniq = k
      if (n.tag) {
        n.attrs = getTagParams(n.attrs)
        const Class = path(['class'], n.attrs)
        n.class = isString(Class)
          ? Class.split(' ')
          : []
        delete n.attrs['class']
        if (n.attrs.id) {
          id[n.attrs.id] = n
        }
      }
    })
  return {
    id
  }
}

export const createPureTextNode = (text, start, end) => ({
    text: text,
    start,
    end,
    link: {
      father: null
    }
  })

export const createRoot = (pushList, noCloses) =>  {
  const root = {
    root: true,
    link: {
      childs: []
    }
  }
  const forceCreateNode = _forceCreateNode(pushList, root)
  noCloses.map(n => forceCreateNode(n))
  return root
}
