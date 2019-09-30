import { domPropsRE } from './attrs'

export type Props = Record<string, any>

export const patchProps = (elm: HTMLElement, prevProps: Props | null, nextProps: Props | null) => {
  if (!prevProps && !nextProps) return
  if (prevProps === nextProps) return
  let oldProps = prevProps || {},
    newProps = nextProps || {}
  for (let key in oldProps) {
    if (!(key in newProps)) {
      delete elm[key]
    }
  }
  for (let key in newProps) {
    let cur = newProps[key],
      old = oldProps[key]
    // domPropsRE相关的只由patchAttr来处理，否则props和attr设置重复值会有覆盖问题
    // if (cur !== old && !domPropsRE.test(key) && elm[key] !== cur) {
    //   elm[key] = cur
    // }
    if (cur !== old && elm[key] !== cur) {
      elm[key] = cur
    }
  }
}
