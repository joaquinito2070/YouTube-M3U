export const error = {}

export const resetError = () => {
  error.forcedCloseTag = []
  error.lostCloseTag = []
}

export const isForcedCloseTag = (openNode, closeNode) => {
  if (!closeNode && !openNode.linked && openNode.open){
    error.forcedCloseTag.push({
      tag: openNode.tag,
      start: openNode.start,
      end: openNode.end
    })
  }
}

export const isLostCloseTag = closeNode => {
  if (closeNode){
    error.lostCloseTag.push({
      tag: closeNode.tag,
      start: closeNode.start,
      end: closeNode.end
    })
  }
}