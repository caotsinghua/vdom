import { VNode } from './vnode'
import { createTextVNode } from './h'
import { VNODE_FLAGS } from './flags/vnode-flags'
import { CHILDREN_FLAGS } from './flags/children_flags'
import { patch, patchData } from './patch'

export function render(vnode: VNode, container: any) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    // 没有旧的vnode，mount新vnode
    mount(vnode, container)
    container.vnode = vnode
  } else {
    if (vnode) {
      // 有旧vnode和新vnode，比较差异并更新
      patch(prevVNode, vnode, container)
      container.vnode = vnode
    } else {
      // 有旧vnode，没有新vnode，表示删除节点
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}

// 挂载一个船新的节点
export function mount(vnode: VNode, container: any, isSvg: boolean = false, refNode?: HTMLElement) {
  console.log('mount', vnode)
  const flags = vnode.flags
  if (flags & VNODE_FLAGS.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSvg, refNode)
  } else if (flags & VNODE_FLAGS.COMPONENT) {
    // 组件
    mountComponent(vnode, container, isSvg)
  } else if (flags & VNODE_FLAGS.TEXT) {
    // 文本
    mountText(vnode, container)
  } else if (flags & VNODE_FLAGS.FRAGMENT) {
    // fragment
    mountFragment(vnode, container, isSvg)
  } else if (flags & VNODE_FLAGS.PORTAL) {
    // portal
    mountPortal(vnode, container, isSvg)
  }
}

function mountElement(vnode: VNode, container: HTMLElement, isSvg: boolean = false, refNode?: HTMLElement) {
  isSvg = !!(vnode.flags & VNODE_FLAGS.ELEMENT_SVG)
  const element = isSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag as string)
    : document.createElement(vnode.tag as string)
  vnode.el = element
  const data = vnode.data
  if (data) {
    for (let key in data) {
      patchData(vnode.el, key, null, data[key])
    }
  }
  // 递归挂载子节点
  const childFlags = vnode.childFlags
  const children = vnode.children

  if (childFlags !== CHILDREN_FLAGS.NO_CHILDREN) {
    // 有子节点
    if (childFlags & CHILDREN_FLAGS.SINGLE_VNODE) {
      mount(children as VNode, element, isSvg)
    } else if (childFlags & CHILDREN_FLAGS.MULTIPLE_VNODES) {
      for (let i = 0; i < (children as VNode[]).length; i++) {
        mount(children[i], element, isSvg)
      }
    }
  }
  if (refNode) {
    container.insertBefore(element, refNode)
  } else {
    container.appendChild(element)
  }
}

/**
 * 挂载文本节点
 * @param {*} vnode
 * @param {*} container
 */
function mountText(vnode: VNode, container: HTMLElement) {
  const element = document.createTextNode(vnode.children as string)
  vnode.el = element
  container.appendChild(element)
}

/**
 * 挂载Fragment
 * @param {*} vnode
 * @param {*} container
 * @param {*} isSvg
 */
function mountFragment(vnode: VNode, container: HTMLElement, isSvg: boolean = false) {
  const { children, childFlags } = vnode
  switch (childFlags) {
    case CHILDREN_FLAGS.SINGLE_VNODE: {
      mount(children as VNode, container, isSvg)
      vnode.el = (children as VNode).el
      break
    }
    case CHILDREN_FLAGS.NO_CHILDREN: {
      // 没有子节点相当于挂载空节点
      const placeholder = createTextVNode('')
      mountText(placeholder, container)
      vnode.el = placeholder.el
      break
    }
    default: {
      for (let i = 0; i < (children as VNode[]).length; i++) {
        mount(children[i], container, isSvg)
      }
      vnode.el = children[0].el
    }
  }
}

function mountPortal(vnode, container, isSvg) {
  const { tag, children, childFlags } = vnode
  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag
  if (childFlags & CHILDREN_FLAGS.SINGLE_VNODE) {
    mount(children, target, isSvg)
  } else if (childFlags & CHILDREN_FLAGS.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[i], target, isSvg)
    }
  }
  // 虽然 Portal 的内容可以被渲染到任意位置，但它的行为仍然像普通的DOM元素一样，
  // 如事件的捕获/冒泡机制仍然按照代码所编写的DOM结构实施
  // 需要一个占位节点
  const placeholder = createTextVNode('')
  mountText(placeholder, container)
  vnode.el = placeholder.el
}

function mountComponent(vnode, container, isSvg) {
  if (vnode.flags & VNODE_FLAGS.COMPONENT_STATEFULL) {
    mountStatefulComponent(vnode, container, isSvg)
  } else {
    mountFunctionalComponent(vnode, container, isSvg)
  }
}

/**
 *
 * @param {*} vnode
 * @param {*} container
 * @param {*} isSvg
 *
 * vnode是要挂载的组件节点h(compnent)
 * instance=vnode.children是new Component
 * instance.$vnode是该instance render后的vnode
 */
function mountStatefulComponent(vnode, container, isSvg) {
  // vnode=lastInstance.$vnode
  // lastInstance.$vnode.children=new lastInstance.vnode.tag()
  // 是因为每个类型为有状态组件的 VNode，在挂载期间我们都会让其 children 属性引用组件的实例，以便能够通过 VNode 访问组件实例对象
  const instance = (vnode.children = new vnode.tag()) // 组件实例

  instance._mounted = false
  instance.$props = vnode.data // 创建实例后绑定props
  instance._update = function() {
    if (instance._mounted) {
      // 更新
      const prevVnode = instance.$vnode
      const nextVnode = (instance.$vnode = instance.render())
      console.log('_update')
      console.log(prevVnode, nextVnode)
      patch(prevVnode, nextVnode, prevVnode.el.parentNode)
      instance.$el = vnode.el = instance.$vnode.el
      // updated
    } else {
      // render=>vnode
      // 刚render时 $vnode.children===null
      instance.$vnode = instance.render() // h('child')
      mount(instance.$vnode, container, isSvg)
      instance._mounted = true // flag
      instance.$el = vnode.el = instance.$vnode.el
      instance.mounted && instance.mounted()
    }
  }
  instance._update()
}
function mountFunctionalComponent(vnode, container, isSvg) {
  console.log('____mountFunctionalComponent')
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      if (vnode.handle.prev) {
        // 更新
        console.log('更新')
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        const props = nextVNode.data
        const prevTree = prevVNode.children
        const nextTree = (nextVNode.children = nextVNode.tag(props))
        patch(prevTree, nextTree, vnode.handle.container)
        console.log('更新结束')
        nextVNode.el = nextTree.el
      } else {
        //挂载
        const props = vnode.data
        const $vnode = (vnode.children = vnode.tag(props))
        mount($vnode, container, isSvg)
        vnode.el = $vnode.el
      }
    }
  }
  // 首次挂载
  vnode.handle.update()
}
