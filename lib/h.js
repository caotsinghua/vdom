import VNodeFlags from './flags/vnode_flags'
import ChildrenFlags from './flags/children_flags'
function h_demo() {
  return {
    _isVNode: true,
    flags: VNodeFlags.ELEMENT_HTML,
    tag: 'h1',
    data: null,
    children: null,
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}
export const Fragment = Symbol.for("Fragment")
export const Portal = Symbol.for("Portal")

export function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target // 表示目标挂载点
  } else {
    // 组件
    if (tag !== null && typeof tag === 'object') {
      flags = tag.functional ? VNodeFlags.COMPONENT_FUNCTIONAL : VNodeFlags.COMPONENT_STATEFULL_NORMAL
    } else if (typeof tag === 'function') {
      flags = tag.prototype && tag.prototype.render ? VNodeFlags.COMPONENT_STATEFULL_NORMAL : VNodeFlags.COMPONENT_FUNCTIONAL
    }
  }
  let childFlags = null
  if (Array.isArray(children)) {
    const length = children.length
    if (length === 0) {
      // 无元素
      childFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      childFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    } else {
      // 多个子节点，且子节点使用key
      childFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
      console.log(children)

    }
  } else if (children == null) {
    // children为null/undefined
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    // 如：普通对象，字符串，数字等
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }
  return {
    _isVNode:true,
    tag,
    flags,
    data,
    children,
    childFlags,
    el:null,
    key:data&&data.key?data.key:null
  }
}

/**
 * 人为创造key节点
 * @param {*} children
 */
function normalizeVNodes(children) {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}

export function createTextVNode(text){
  return {
    _isVNode:true,
    tag:null,
    data:null,
    flags:VNodeFlags.TEXT,
    children:text,
    childFlags:ChildrenFlags.NO_CHILDREN,
    el:null
  }
}

function getFlagName(vnode){
  const key=Object.keys(VNodeFlags).find(key=>VNodeFlags[key]===vnode.flags);
  return key;
}
function getChildFlagName(vnode){
  const key=Object.keys(ChildrenFlags).find(key=>ChildrenFlags[key]===vnode.childFlags);
  return key;
}

