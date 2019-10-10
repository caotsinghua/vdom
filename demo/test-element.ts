import { h } from '../src/h'
import { render } from '../src/render'
import { Component } from '../src/component'
import { VNode } from '../src/vnode'
const n2 = h('div', [h('p', '111'), h('span', '222')])
const n1 = h(
  'div',
  {
    style: {
      border: '1px solid #ccc'
    }
  },
  [
    h('p', { key: 1 }, '第一个节点'),
    h(
      'button',
      {
        key:2,
        onclick: () => {
          render(n2, document.getElementById('app'))
        }
      },
      '改变'
    )
  ]
)

render(n1, document.getElementById('app'))
