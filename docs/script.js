'use strict'

let myNum = 1

/*
  Make root element object, contains meta-info
  keys: object with direct references to elements, must be unique (enforce this) (alternately, make it pathed? I like unique better)
*/


const virtualDOM = [
  {
    elm: 'div',
    id: 'app-main',
    children: [
      {
        elm: 'header',
        children: [
          {
            elm: 'h1',
            children: 'This is my demo of a virtual dom.'
          }
        ]
      },
      {
        elm: 'main',
        children: [
          {
            elm: 'p',
            id: 'first-paragraph',
            children: 'This is the first paragraph. It has an id but not a class.'
          },
          {
            elm: 'p',
            classes: 'mono mt',
            children: 'This is the second paragraph. It has a class but not an id.'
          },
          {
            elm: 'div',
            children: [
              {
                elm: 'button',
                onClick: increaseCount,
                children: 'click to increase count'
              },
              {
                elm: 'span',
                classes: 'ml',
                children: () => myNum
              }
            ]
          }
        ]
      }
    ]
  }
]

function increaseCount() {
  myNum += 1
  loadNodes()
}

document.addEventListener('DOMContentLoaded', loadNodes)

function loadNodes() {
  const root = document.getElementById('root')
  const newRoot = document.createElement('div')
  newRoot.id = 'root'
  const newNodes = recursiveCreate(virtualDOM)
  newNodes.forEach(node => newRoot.appendChild(node))
  root.replaceWith(newRoot)
  // Create global for reference elsewhere:
  window.vDOM = virtualDOM
  console.log(window.vDOM)
}

function recursiveCreate(vDom) {
  // vDom is an array of objects that can be used to create html nodes
  return vDom.map(node => {
    const { elm, id, classes, onClick, children } = node
    const newNode = document.createElement(elm)
    let content = null // used because we don't want to recursively get textContent
    node.ref = newNode
    if (id) newNode.id = id
    if (classes) {
      classes.split(' ').forEach(newClass => newNode.classList.add(newClass))
    }
    if (onClick) newNode.addEventListener('click', onClick)
    if (children) {
      if (typeof children === 'string' || typeof children === 'number') {
        newNode.textContent = children
        content = newNode.textContent
      } else if (typeof children === 'function') {
        newNode.textContent = children()
        content = newNode.textContent
      } else if (Array.isArray(children)) {
        const nodeChildren = recursiveCreate(children)
        nodeChildren.forEach(child => newNode.appendChild(child))
      } else {
        throw new Error('Unknown typeof value for child.')
      }
    }
    node.hash = hashNode(node, content)
    if (content) console.log('hash:', node.hash)
    return newNode
  })
}

function hashNode(node, textContent) {
  let str = textContent || ''
  Object.entries(node).map(([entry, value]) => {
    if (entry !== 'children' && entry !== 'ref' && entry !== 'hash') {
      str += value
    }
  })
  return hashStr(str)
}

function hashStr(str) {
  const len = str.length
  let hash = 0
  let chr = null
  for (let i = 0; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

