import { h } from '../src/h'
import { render } from '../src/render'
import { Component } from '../src/component'
import { VNode } from '../src/vnode'

function testH(node1, node2) {
  render(node1, document.getElementById('app'))
  setTimeout(() => {
    render(node2, document.getElementById('app'))
  }, 2000)
}
// 测试更新children
function TestPatchChildren() {
  const node1 = h('div', { style: { border: '1px solid #000' } }, [
    h('span', { key: 'a' }, '第一个节点'),
    h('span', { key: 'b' }, '第二个节点'),
    h('span', { key: 'c' }, '第三个节点')
  ])
  const node2 = h('div', { style: { border: '1px solid blue' } }, [
    h('span', { key: 'c' }, '第三个节点change'),
    h('span', { key: 'b' }, '第一个节点'),
    h('span', { key: 'd' }, '第二个节点'),
    h('span', { key: 'e' }, '第四个节点')
  ])
  render(node1, document.getElementById('app'))
  setTimeout(() => {
    render(node2, document.getElementById('app'))
  }, 2000)
}

// TestPatchChildren()
// 测试组件
function TestClassComponent() {
  class Parent1 extends Component {
    render(): VNode {
      return h('div', 'hello')
    }
  }
  class Parent2 extends Component {
    render(): any {
      return h('div', { style: { width: '100px', height: '100px', border: '1px solid #ccc' } })
    }
  }
  render(h(Parent1), document.getElementById('app'))
  setTimeout(() => {
    render(h(Parent2), document.getElementById('app'))
  }, 2000)
}
// TestClassComponent()

function TestFunction() {
  function f1() {
    return h('div', [h('span', 'span-1'), h('span', 'span-2')])
  }
  function f2() {
    return h('div', [h('span', 'spans'), h('span', 'dd'), h('span', 'dad')])
  }
  testH(h(f1), h(f2))
}
// TestFunction()

function TestSub() {
  class Parent extends Component {
    str = '初始值'
    mounted() {
      setTimeout(() => {
        this.str = '改变后'
        this._update()
      }, 2000)
    }
    render() {
      return h(Child1, { str: this.str })
    }
  }
  class Child1 extends Component {
    render() {
      return h('div', this.$props.str)
    }
  }
  render(h(Parent), document.getElementById('app'))
}
// TestSub()

class Index extends Component {
  src = ''
  toTestElement = () => {
    this.src = '/test-element.html'
    this._update()
  }
  render() {
    return h('div', [
      h(
        'div',
        {
          class: 'header',
          key: 'header'
        },
        [h('a', { href: '#!', onclick: this.toTestElement }, 'test-element')]
      ),
      h('div', { class: 'main', key: 'main' }, [
        h('iframe', {
          width: '100%',
          height: '500px',
          src: this.src
        })
      ])
    ])
  }
}

render(h(Index), document.getElementById('app'))
