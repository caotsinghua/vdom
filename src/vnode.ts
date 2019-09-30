import { VNODE_FLAGS } from './flags/vnode-flags'
import { Component } from './component'
import { Classes } from './module/class'
import { VNodeStyle } from './module/style'
import { On } from './module/event-listeners'
import { CHILDREN_FLAGS } from './flags/children_flags'
export type Tag = string | Function | Component | Symbol
export type Children = Array<VNode> | VNode
export interface VNode {
  _isVNode: boolean
  flags: VNODE_FLAGS
  tag: Tag
  data: VNodeData | undefined
  children: Children
  childFlags: CHILDREN_FLAGS
  el: Node | undefined
  key: string | number
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
