export type Attrs = Record<string, string | number | boolean>
export const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/
const xlinkNS = 'http://www.w3.org/1999/xlink'
const xmlNS = 'http://www.w3.org/XML/1998/namespace'
const colonChar = 58 // ：
const xChar = 120 // x
export const patchAttrs = (elm: HTMLElement, prevAttrs: Attrs | null, nextAttrs: Attrs | null) => {
  if (!prevAttrs && !nextAttrs) return
  if (prevAttrs === nextAttrs) return
  let oldAttrs = prevAttrs || {}
  let newAttrs = nextAttrs || {}
  for (let key in newAttrs) {
    if (domPropsRE.test(key)) {
      elm[key] = newAttrs[key]
    } else {
      if (key.charCodeAt(0) !== xChar) {
        elm.setAttribute(key, newAttrs[key] as string) // 不以x开头
      } else if (key.charCodeAt(3) === colonChar) {
        // :
        elm.setAttributeNS(xmlNS, key, newAttrs[key] as string)
      } else if (key.charCodeAt(5) === colonChar) {
        elm.setAttributeNS(xlinkNS, key, newAttrs[key] as string)
      } else {
        elm.setAttribute(key, newAttrs[key] as string)
      }
    }
  }

  for (let key in oldAttrs) {
    if (!(newAttrs as Object).hasOwnProperty(key)) {
      elm.removeAttribute(key)
    }
  }
}
