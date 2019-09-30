/**
 * 解析class名
 */

export type Classes = string | Record<string, boolean> | Array<string | Record<string, boolean>>

export function patchClass(elm: HTMLElement, nextClass: Classes | undefined) {
  if (nextClass) {
    elm.className = parseClassNames(nextClass)
  } else {
    elm.className = ''
  }
}

function parseClassNames(classList: Classes): string {
  if (typeof classList === 'string') {
    return classList
  }
  let cls = []
  if (Object.prototype.toString.call(classList) === '[object Object]') {
    for (let klass in classList) {
      if (classList[klass]) {
        cls.push(klass)
      }
    }
  } else if (Array.isArray(classList)) {
    for (let i = 0; i < classList.length; i++) {
      cls.push(parseClassNames(classList[i]))
    }
  }
  return cls.join(' ')
}
