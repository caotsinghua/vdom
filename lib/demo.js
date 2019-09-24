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
h(Portal, { target: "#portal-point" }, [h('p', null, 'portal1'), h('p', null, 'portal2')])
])
class Foo {
  render() {
    return h('h1', null, 'hello')
  }
}
function FooFunc() {
  return h('h1', null, 'foofunc')
}

const TestPatchDataTag = h('p', {
  style: {
    color: '#f00',
    'font-size': '14px'
  },
  onclick: () => {
    console.log("点击了")
  }
}, 'test-patch-data-tag')
const TestPatchDataTag2 = h('p', {
  style: {
    color: '#000',
    'font-size': '14px'
  }
}, [
  h('span', { style: { color: '#ff0' } }, 'aaa-'),
  h('span', null, 'bbb')
])
const TestPatchDataTag3 = h('p', {
  style: {
    color: '#000',
    'font-size': '14px'
  }
}, [
  h('span', { style: { color: '#f00' } }, 'aaa-'),
  h('span', null, 'bbb')
])
// render(TestPatchDataTag2, document.getElementById("app"))
// setTimeout(()=>{
//   render(TestPatchDataTag3, document.getElementById("app"))
// },2000)
// render(TestPatchDataTag, document.getElementById("app"))

// const fragmentNode1 = h(Fragment, {
//   style: {
//     color: '#f00'
//   }
// }, [
//   h('span', null, 'span1'),
//   h('span', null, 'span2')
// ])
// const fragmentNode2 = h(Fragment, {
//   style: {
//     color: '#ff0'
//   }
// }, [
//   h('p', { style: { color: "#f00" } }, 'span111'),
//   h('h2', null, 'span222')
// ])
// render(fragmentNode1, document.getElementById("app"))
// setTimeout(() => {
//   render(fragmentNode2, document.getElementById("app"))
// }, 2000)
// const portalNode1 = h(Portal, {
//   target:'#portal-1',
//   style: {
//     color: '#f00'
//   }
// }, [
//   h('span', null, 'span1'),
//   h('span', null, 'span2')
// ])
// const portalNode2 = h(Portal, {
//   target:'#portal-2',
//   style: {
//     color: '#ff0'
//   }
// }, [
//   h('p', { style: { color: "#f00" } }, 'span111'),
//   h('h2', null, 'span222')
// ])
// render(portalNode1, document.getElementById("app"))
// setTimeout(() => {
//   render(portalNode2, document.getElementById("app"))
// }, 2000)

class Compo1 {
  localState = 'one'
  mounted() {
    this.localState = "tow";
    this._update()
  }
  render() {
    return h('div', { style: { color: '#f00' } }, this.localState)
  }
}

render(Compo1,document.getElementById('app'))
