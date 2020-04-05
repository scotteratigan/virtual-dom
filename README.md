# virtual-dom

Create and manipulate a virtual dom to render html to page.

```javascript
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
```
