import { VNode, Tag, VNodeData, Children, vnode } from './vnode'
import { VNODE_FLAGS } from './flags/vnode-flags'
import { Fragment, Portal } from './vnode'
import { Component } from './component'
import { CHILDREN_FLAGS } from './flags/children_flags'

export function h(tag: Tag): VNode
export function h(tag: Tag, data: VNodeData): VNode
export function h(tag: Tag, children: Children): VNode
export function h(tag: Tag, data: VNodeData, children: Children | string): VNode
export function h(tag: Tag, data?: any, children?: any): VNode {
  /**
   * 检查节点的类型
   */
  let flags: VNODE_FLAGS
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNODE_FLAGS.ELEMENT_SVG : VNODE_FLAGS.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNODE_FLAGS.FRAGMENT
  } else if (tag === Portal) {
    flags = VNODE_FLAGS.PORTAL
    tag = data && data.target // 表示目标挂载点
  } else {
    // 组件
    if (tag instanceof Component) {
      flags = tag.functional ? VNODE_FLAGS.COMPONENT_FUNCTIONAL : VNODE_FLAGS.COMPONENT_STATEFULL_NORMAL
    } else if (typeof tag === 'function') {
      flags =
        tag.prototype && tag.prototype.render
          ? VNODE_FLAGS.COMPONENT_STATEFULL_NORMAL
          : VNODE_FLAGS.COMPONENT_FUNCTIONAL
    }
  }
  let childFlags: CHILDREN_FLAGS
  if (Array.isArray(children)) {
    const length = children.length
    if (length === 0) {
      // 无元素
      childFlags = CHILDREN_FLAGS.NO_CHILDREN
    } else if (length === 1) {
      childFlags = CHILDREN_FLAGS.SINGLE_VNODE
      children = children[0]
    } else {
      // 多个子节点，且子节点使用key
      childFlags = CHILDREN_FLAGS.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  } else if (children == null) {
    // children为null/undefined
    childFlags = CHILDREN_FLAGS.NO_CHILDREN
  } else if ((children as VNode)._isVNode) {
    childFlags = CHILDREN_FLAGS.SINGLE_VNODE
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    // 如：普通对象，字符串，数字等
    childFlags = CHILDREN_FLAGS.SINGLE_VNODE
    children = createTextVNode(children + '')
  }

  return vnode(tag, data, children, flags, childFlags, undefined)
}

/**
 * 人为创造key节点
 * @param {*} children
 */
function normalizeVNodes(children: VNode[]): Children {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child: VNode = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}

export function createTextVNode(text: string): VNode {
  return {
    _isVNode: true,
    tag: null,
    data: null,
    flags: VNODE_FLAGS.TEXT,
    children: text,
    childFlags: CHILDREN_FLAGS.NO_CHILDREN,
    el: null,
    key: null
  }
}
