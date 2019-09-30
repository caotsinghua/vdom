import { VNode } from './vnode'

export abstract class Component {
  functional: boolean = false
  abstract render(): VNode
}
