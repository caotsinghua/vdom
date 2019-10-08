import { VNODE_FLAGS } from './flags/vnode-flags'
import { Component } from './component'
import { Classes } from './module/class'
import { VNodeStyle } from './module/style'
import { On } from './module/event-listeners'
import { CHILDREN_FLAGS } from './flags/children_flags'

export const Portal = Symbol.for('portal')
export const Fragment = Symbol.for('fragment')

export type Tag = string | Function | Component | typeof Fragment | typeof Portal
export type Children = Array<VNode> | VNode | string
export interface VNode {
  _isVNode: boolean // 是否是vnode
  flags: VNODE_FLAGS // 节点类型
  tag: Tag // vnode类型
  data: VNodeData | undefined // 数据(style,props...)
  children: Children // 子节点
  childFlags: CHILDREN_FLAGS // 子节点类型 (单节点，多节点...)
  el: Node | undefined // 挂载的真实dom
  key: string | number // key
}

export interface VNodeData {
  class?: Classes
  style?: VNodeStyle
  on?: On
  key?: string | number
  target?: string
}

export function vnode(
  tag: Tag,
  data: VNodeData | undefined,
  children: Children,
  flags: VNODE_FLAGS,
  childFlags: CHILDREN_FLAGS,
  el: Node | undefined
): VNode {
  const key = data.key ? data.key : undefined
  return {
    _isVNode: true,
    tag,
    data,
    children,
    el,
    key,
    childFlags,
    flags
  }
}
