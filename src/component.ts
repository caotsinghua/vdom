import { VNode } from './vnode'

export abstract class Component {
  functional: boolean = false
  $props: any
  _update: () => void
  abstract render(): VNode
}
