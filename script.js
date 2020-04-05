let myCount = {
  val: 1
};


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
                children: () => myCount.val
              }
            ]
          }
        ]
      }
    ]
  }
];

function increaseCount() {
  console.log('increasing count...')
  myCount.val += 1;
  window.myCount = myCount;
  loadNodes();
}

document.addEventListener('DOMContentLoaded', () => {
  loadNodes();
});

function loadNodes() {
  const root = document.getElementById('root');
  console.log('root', root)
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  const newNodes = recursiveCreate(virtualDOM);
  newNodes.forEach(node => newRoot.appendChild(node));
  console.log('Loaded nodes:');
  console.log(virtualDOM);
  root.replaceWith(newRoot);
  // Create global for reference elsewhere:
  // window.vDOM = virtualDOM;
}


function recursiveCreate(nodeList) {
  // nodeList is an array of objects that can be used to create nodes
  return nodeList.map(node => {
    console.log('creating node:', node)
    const { elm, id, classes, onClick, children } = node;
    const newNode = document.createElement(elm);
    node.ref = newNode;
    if (id) newNode.id = id;
    if (classes) {
      classes.split(' ').forEach(newClass => newNode.classList.add(newClass))
    }
    if (onClick) newNode.addEventListener("click", onClick);
    if (children) {
      if (typeof children === "string" || typeof children === "number") {
        // todo: handle case of function
        newNode.textContent = children;
      } else if (typeof children === "function") {
        newNode.textContent = children();
      }else if (Array.isArray(children)) {
        const nodeChildren = recursiveCreate(children);
        nodeChildren.forEach(child => newNode.appendChild(child));
      } else {
        throw new Error("Unknown typeof value for child.");
      }
    }
    return newNode;
  })
}