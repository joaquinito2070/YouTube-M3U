import { parse as oldParse } from './old-parse'
import parse from '../src/parse'
import assert from 'assert'
import fs from 'fs'

const html01 = fs.readFileSync(`./test/files/01.html`, 'utf8')
const svg01 = fs.readFileSync(`./test/files/01.svg`, 'utf8')
const svg02 = fs.readFileSync(`./test/files/02.svg`, 'utf8')

const showOld = oldTree => {
  let nodes = 0, texts = 0

  const deepNode = n => {
    nodes += 1
    typeof n.inner === 'string' && !!n.inner ? texts += 1 : null
    n.link.down.map(
      n => deepNode(n))
  }

  oldTree.Objs.map(
    n => deepNode(n))

  show(oldTree.Objs.length, nodes, texts)
}

const showNew = tree => {
  const root = tree.tree.link.childs
  const nodes = tree.list.filter(n=>n.tag)
  const texts = tree.list.filter(n=>!n.tag)

  // texts.map(
  //   n => console.log(n))

  return show(root.length, nodes.length, texts.length)
}

const show = (roots, nodes, texts) => {
  console.log(`root: ${roots} nodes: ${nodes} texts: ${texts}`)
  return { roots, nodes, texts }
}

describe('extractor', function() {
  it('simple time test', function() {
    console.time('oldParse')
    const oldTree = oldParse(html01)
    console.timeEnd('oldParse')
    showOld(oldTree)

    console.time('parse')
    const tree = parse(html01)
    console.timeEnd('parse')
    showNew(tree)
    console.log(tree.error)
  })

  it('hard time test with 01', function() {
    console.time('oldParse')
    const oldTree = oldParse(svg01)
    console.timeEnd('oldParse')
    showOld(oldTree)

    console.time('parse')
    const tree = parse(svg01)
    console.timeEnd('parse')    
    showNew(tree)
    console.log(tree.error)
  })

  it('hard time test with 02', function() {
    console.time('oldParse')
    const oldTree = oldParse(svg02)
    console.timeEnd('oldParse')
    showOld(oldTree)

    console.time('parse')
    const tree = parse(svg02)
    console.timeEnd('parse')    
    showNew(tree)
    console.log(tree.error)
  })

  it('new parse test count', function() {
    let tree = parse(html01)
    let ret = showNew(tree)
    assert.deepEqual(ret, { roots: 2, nodes: 4, texts: 6 })

    tree = parse(svg01)
    ret = showNew(tree)
    assert.deepEqual(ret, { roots: 3, nodes: 338, texts: 1 })

    tree = parse(svg02)
    ret = showNew(tree)
    assert.deepEqual(ret, { roots: 3, nodes: 325, texts: 1 })
  })
})
