export type VNodeStyle = Record<string, string>

export function patchStyle(elm: HTMLElement, prevStyle: VNodeStyle | undefined, nextStyle: VNodeStyle | undefined) {
  let oldStyle = prevStyle || {},
    newStyle = nextStyle || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      elm.style[key] = ''
    }
  }
  for (let key in newStyle) {
    elm.style[key] = newStyle[key]
  }
}
