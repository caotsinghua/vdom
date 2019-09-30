import { VNode, VNodeData } from '../vnode'

export type On = {
  [N in keyof ElementEventMap]?: (ev: ElementEventMap[N]) => void
} & {
  [event: string]: EventListener
}

function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode)
  }
}

function handleEvent(event: Event, vnode: VNode) {
  const name = event.type
  const on = (vnode.data as VNodeData).on
}

export function patchEventListeners(elm: HTMLElement, prevListeners: On | null, nextListeners: On | null) {
  let oldOn = prevListeners || {},
    newOn = nextListeners || {}

  if (!oldOn && !newOn) return
  if (oldOn === newOn) return

  for (let key in oldOn) {
    if (!(key in newOn)) {
      elm.removeEventListener(key, oldOn[key], false)
    }
  }

  for (let key in newOn) {
    elm.addEventListener(key, newOn[key], false)
  }
}
