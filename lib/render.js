import VNodeFlags from "./flags/vnode_flags"
import childrenFlags from "./flags/children_flags";
import { createTextVNode } from './h'
import patch from './patch'
/**
 * 渲染器
 * 将vnode渲染成真实dom
 */
export function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    // 没有旧的vnode，mount新vnode
    mount(vnode, container)
    container.vnode=vnode
  } else {
    if (vnode) {
      // 有旧vnode和新vnode，比较差异并更新
      patch(prevVNode, vnode, container)
      container.vnode = vnode
    } else {
      // 有旧vnode，没有新vnode，表示删除节点
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}

// 挂载一个船新的节点
function mount(vnode, container, isSvg) {
  console.log("mount", vnode)
  const flags = vnode.flags
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSvg)
  } else if (flags & VNodeFlags.COMPONENT) {
    // 组件
    mountComponent(vnode, container,isSvg)
  } else if (flags & VNodeFlags.TEXT) {
    // 文本
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    // fragment
    mountFragment(vnode, container, isSvg)
  } else if (flags & VNodeFlags.PORTAL) {
    // portal
    mountPortal(vnode, container,isSvg)
  }
}
const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSvg) {
  isSvg = isSvg || vnode.flags & VNodeFlags.ELEMENT_SVG;
  const element = isSvg ? document.createElementNS('http://www.w3.org/2000/svg') : document.createElement(vnode.tag);
  vnode.el = element;
  const data = vnode.data;
  if (data) {
    for (let key in data) {
      switch (key) {
        case 'style': {
          for (let styleKey in data.style) {
            element.style[styleKey] = data.style[styleKey];
          }
          break;
        }
        case 'class': {
          element.className = parseClassNames(data.class)
          break;
        }
        default: {
          if (/^on/.test(key)) {
            // 绑定事件
            element.addEventListener(key.slice(2), data[key]);
          } else if (domPropsRE.test(key)) {
            // 作为dom prop处理
            element[key] = data[key];
          } else {
            // 作为Attr处理
            element.setAttribute(key, data[key]);
          }
        }
      }
    }
  }
  // 递归挂载子节点
  const childFlags = vnode.childFlags;
  const children = vnode.children;

  if (childFlags !== childrenFlags.NO_CHILDREN) {
    if (childFlags & childrenFlags.SINGLE_VNODE) {
      mount(children, element, isSvg);
    } else if (childFlags & childrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], element, isSvg)
      }
    }
  }
  container.appendChild(element);
}

function parseClassNames(classList) {
  if (typeof classList === 'string') {
    return classList;
  }
  let cls = [];
  if (Object.prototype.toString.call(classList) === '[object Object]') {
    for (let klass in classList) {
      if (classList[klass]) {
        cls.push(klass)
      }
    }
    return cls;
  } else if (Array.isArray(classList)) {
    for (let i = 0; i < classList.length; i++) {
      cls.push(parseClassNames(classList[i]));
    }
  }
  return cls.join(' ');
}

/**
 * 挂载文本节点
 * @param {*} vnode
 * @param {*} container
 */
function mountText(vnode, container) {
  const element = document.createTextNode(vnode.children);
  vnode.el = element;
  container.appendChild(element);
}

/**
 * 挂载Fragment
 * @param {*} vnode
 * @param {*} container
 * @param {*} isSvg
 */
function mountFragment(vnode, container, isSvg) {
  const { children, childFlags } = vnode;
  switch (childFlags) {
    case childrenFlags.SINGLE_VNODE: {
      mount(children, container, isSvg)
      vnode.el = children.el;
      break
    }
    case childFlags.NO_CHILDREN: {
      // 没有子节点相当于挂载空节点
      const placeholder = createTextVNode('')
      mountText(placeholder, container)
      vnode.el = placeholder.el;
      break
    }
    default: {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSvg)
      }
      vnode.el = children[0].el;
    }
  }
}

function mountPortal(vnode, container,isSvg) {
  const { tag, children, childFlags } = vnode;
  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag;
  if (childFlags & childrenFlags.SINGLE_VNODE) {
    mount(children, target,isSvg);
  } else if (childFlags & childrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[i], target,isSvg);
    }
  }
  // 虽然 Portal 的内容可以被渲染到任意位置，但它的行为仍然像普通的DOM元素一样，
  // 如事件的捕获/冒泡机制仍然按照代码所编写的DOM结构实施
  // 需要一个占位节点
  const placeholder = createTextVNode('')
  mountText(placeholder, container, null);
  vnode.el = placeholder.el;
}

function mountComponent(vnode,container,isSvg){
  if(vnode.flags&VNodeFlags.COMPONENT_STATEFULL){
    mountStatefulComponent(vnode,container,isSvg)
  }else{
    mountFunctionalComponent(vnode,container,isSvg)
  }
}

function mountStatefulComponent(vnode,container,isSvg){
  const instance=new vnode.tag();
  instance.$vnode=instance.render();
  mount(instance.$vnode,container,isSvg);
  instance.$el=vnode.el=instance.$vnode.el;
}
function mountFunctionalComponent(vnode,container,isSvg){
  const $vnode=vnode.tag();
  mount($vnode,container,isSvg)
  vnode.el=$vnode.el;
}
