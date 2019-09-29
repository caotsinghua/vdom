import { VNODE_FLAGS } from './flags/vnode-flags'
import { Component } from './component'
import { Classes } from './modules/class'
import { VNodeStyle } from './modules/style'

export interface VNode {
  _isVNode: boolean
  flags: VNODE_FLAGS
  tag: string | Function | Component | Symbol
  data: object | null
  children: Array<object | null> | null
  childrenFlags: string
  el: object | null
}

export interface VNodeData {
  class?: Classes
  style?: VNodeStyle
}
