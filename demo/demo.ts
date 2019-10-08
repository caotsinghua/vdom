import { h } from '../src/h'
import { render } from '../src/render'
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

TestPatchChildren()
