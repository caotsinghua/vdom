import { VNode } from './vnode'

export abstract class Component {
  abstract render(): VNode
}
