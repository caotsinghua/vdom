import { h, Fragment, Portal } from './h';
import { render } from './render'


const demoNode = h('div', {
  style: {
    background: "#ccc",
    border: '1px solid #000'
  },
  class: 'wrap'
}, [h('div', {
  style: {
    background: '#f00',
    width: '20px',
    height: '20px',
  },
  class: [
    'inner-box',
    {
      active: true,
      disabled: false
    },
    ['box1', 'box2']
  ],
  onclick: function () {
    console.log("点击了内层盒子")
  }
}),
h('p', null, h(Fragment, null, [h('span', null, 1), h('span')])),
h(Portal,{target:"#portal-point"},[h('p',null,'portal1'),h('p',null,'portal2')])
  ])
class Foo {
  render(){
    return h('h1',null,'hello')
  }
}
function FooFunc(){
  return h('h1',null,'foofunc')
}
render(h(FooFunc), document.getElementById("app"))
render(h(FooFunc), document.getElementById("app"))
