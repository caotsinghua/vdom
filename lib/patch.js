import VNodeFlags from './flags/vnode_flags'
import { mount } from './render'
import childrenFlags from './flags/children_flags';

function isDef(n) {
  return n !== undefined
}
function isUnDef(n) {
  return n === undefined
}
// 找出最长递增子序列，非连续
function lis(source) {

}
export const patch = function (prevVNode, vnode, container) {
  console.log('====patch====')
  const nextFlags = vnode.flags;
  const prevFlags = prevVNode.flags;

  if (prevFlags !== nextFlags) {
    // 节点类型不一样
    console.log("replace vnode")
    replaceVnode(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    console.log("patch element")
    patchElement(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    console.log("patch component")
    patchComponent(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    console.log("patch text")
    patchText(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    console.log("patch fragment")
    patchFragment(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    console.log("patch portal")
    patchPortal(prevVNode, vnode)
  }
}
/**
 *
 * @param {*} el
 * @param {*} key
 * @param {*} prevValue
 * @param {*} nextValue
 * 有nextValue，更新/新增，直接替代原来值
 * 无nextValue，删除
 */
export const patchData = (el, key, prevValue, nextValue) => {
  // innerHTML等
  const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/
  switch (key) {
    case 'style': {
      if (nextValue) {
        for (let styleKey in nextValue) {
          el.style[styleKey] = nextValue[styleKey];
        }
      } else {
        for (let styleKey in prevValue) {
          delete el.style[styleKey]
        }
      }
      break;
    }
    case 'class': {
      if (nextValue) {
        el.className = parseClassNames(nextValue)
      } else {
        el.className = '';
      }
      break;
    }
    default: {
      if (/^on/.test(key)) {
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue);
        }
        if (nextValue) {
          // 绑定事件
          el.addEventListener(key.slice(2), nextValue);
        }

      } else if (domPropsRE.test(key)) {
        // 作为dom prop处理
        el[key] = nextValue;
      } else {
        // 作为Attr处理
        el.setAttribute(key, nextValue);
      }
    }
  }
}
function replaceVnode(prevVNode, vnode, container) {
  console.log("===replace-vnode===")
  // TODO:BUGS
  container.removeChild(prevVNode.el);
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFULL) {
    const instance = prevVNode.children
    // 触发钩子函数
    instance.unmounted && instance.unmounted()
  }
  mount(vnode, container)
}

function patchElement(prevVNode, vnode, container) {
  console.log("=====patch-element====")
  if (prevVNode.tag !== vnode.tag) {
    // 新旧节点标签不同
    replaceVnode(prevVNode, vnode, container)
    return
  }
  // 标签相同，比较内容，属性
  const el = vnode.el = prevVNode.el;
  console.log(el)
  const prevData = prevVNode.data;
  const nextData = vnode.data;

  if (nextData) {

    // 存在新的data
    for (let key in nextData) {
      const prevValue = prevData[key];
      const nextValue = nextData[key];
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    for (let key in prevData) {
      const prevValue = prevData[key];
      if (!nextData.hasOwnProperty(key)) {
        patchData(el, key, prevValue, null)
      }
    }
  }
  // 递归更新子节点
  patchChildren(
    prevVNode.childFlags,
    vnode.childFlags,
    prevVNode.children,
    vnode.children,
    el // 当前节点元素，即子节点的父节点
  )
}
function patchChildren(prevChildFlags, nextChildFlags, prevChildren, nextChildren, parentEl) {
  console.log("patchChildren")
  switch (prevChildFlags) {
    case childrenFlags.SINGLE_VNODE: {
      // 前一子节点为单节点
      switch (nextChildFlags) {
        case childrenFlags.SINGLE_VNODE: {
          // 新节点为单节点
          console.log(prevChildren, nextChildren)
          patch(prevChildren, nextChildren, parentEl)
          break
        }
        case childrenFlags.NO_CHILDREN: {
          // 新节点无节点，即删除
          parentEl.removeChild(prevChildren.el);
          break;
        }
        default: {
          // 新子节点为多个节点
          parentEl.removeChild(prevChildren.el);
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], parentEl)
          }

        }
      }
      break;
    };
    case childrenFlags.NO_CHILDREN: {
      // 前一子节点为空
      switch (nextChildFlags) {
        case childrenFlags.SINGLE_VNODE: {
          // 新节点为单节点
          mount(nextChildren, parentEl)
          break;
        }
        case childrenFlags.NO_CHILDREN: {
          // 新节点无节点，即删除
          break;
        }
        default: {
          // 新子节点为多个节点
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], parentEl)
          }
        }
      }
      break;
    };
    default: {
      // 前一子节点为多个节点
      console.log("前一子节点为多个节点")
      switch (nextChildFlags) {
        case childrenFlags.SINGLE_VNODE: {
          // 新节点为单节点
          // 移除旧节点数组，挂载新节点
          for (let i = 0; i < prevChildren.length; i++) {
            parentEl.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, parentEl)
          break;
        }
        case childrenFlags.NO_CHILDREN: {
          // 新节点无节点，即删除
          for (let i = 0; i < prevChildren.length; i++) {
            parentEl.removeChild(prevChildren[i].el)
          }
          break;
        }
        default: {
          console.log("新子节点为多个节点", nextChildren)
          // 新子节点为多个节点
          // TODO:diff
          function simpleDiff() {
            // 简单diff===========
            for (let i = 0; i < prevChildren.length; i++) {
              parentEl.removeChild(prevChildren[i].el)
            }
            for (let i = 0; i < nextChildren.length; i++) {
              mount(nextChildren[i], parentEl)
            }
            // =========end
          }
          // diffWithoutKey();
          function diffWithoutKey() {
            const prevLen = prevChildren.length;
            const nextLen = nextChildren.length;
            const len = Math.min(prevLen, nextLen);
            for (let i = 0; i < len; i++) {
              // 对同级的节点进行patch
              patch(prevChildren[i], nextChildren[i], parentEl)
            }
            if (nextLen > prevLen) {
              // 新节点多余旧节点，添加新的节点
              for (let i = len; i < nextLen; i++) {
                mount(nextChildren[i], parentEl);
              }
            } else {
              // 移除旧节点
              for (let i = prevLen - 1; i >= len; i--) {
                parentEl.removeChild(prevChildren[i].el)
              }
            }
          }

          /**
          * react-diff
          * 思路在于：
          * 1.找到新旧节点数组中key相同的节点，执行patch
          * 2.找出新旧顺序不一致的节点，对于新节点在旧dom中的索引小于lastIndex的，需要移动位置
          * 插入的位置是：当前要移动的node在nextChildren中的前一个节点，该节点在原dom元素的后一个dom是我们要插入的位置
          * 3.移动完带key元素后，看新节点是否在旧节点钟存在，如果新节点则插入
          * 4.遍历旧节点，对不存在于新节点中的进行删除操作
          */
          function diffWithKey1() {
            let lastIndex = 0; // 寻找过程中遇到的最大索引值
            for (let i = 0; i < nextChildren.length; i++) {
              const nextChild = nextChildren[i];
              let find = false
              for (let j = 0; j < prevChildren.length; j++) {
                if (prevChildren[j].key === nextChild.key) {
                  find = true
                  // 只对key值一致的节点更新data和children
                  patch(prevChildren[j], nextChild, parentEl)
                  if (j < lastIndex) {
                    // 该节点需要移动
                    // 此时nextChild已经存在el，见103行
                    // 当前要移动的node在nextChildren中的前一个节点，该节点在原dom元素的后一个dom是我们要插入的位置
                    const refNode = nextChildren[i - 1].el.nextSibling;
                    // 移动dom
                    console.log("移动")
                    parentEl.insertBefore(prevChildren[j].el, refNode)
                  } else {
                    // 更新lastindex
                    lastIndex = j;
                  }
                  break
                }
              }
              if (!find) {

                const refNode = i - 1 < 0 ? prevChildren[0].el : nextChildren[i - 1].el.nextSibling;
                // 插入到正确位置
                // nextChildren中当前元素的前一个元素在实际dom中的元素的后一个节点，插入到该节点前
                // 如果是第一个元素，还未patch和移动过，则插入到旧节点的第一个元素前
                console.log("添加节点", nextChild, refNode)
                mount(nextChild, parentEl, false, refNode)
              }
            }
            /**
           * 我们需要在外层循环结束之后，再优先遍历一次旧的 children，
           * 并尝试拿着旧 children 中的节点去新 children 中寻找相同的节点，
           * 如果找不到则说明该节点已经不存在于新 children 中了，这时我们应该将该节点对应的真实 DOM 移除
           */
            for (let i = 0; i < prevChildren.length; i++) {
              const prevChild = prevChildren[i];
              const has = nextChildren.find(nextChild => nextChild.key === prevChild.key);
              if (!has) {
                console.log("移除", prevChild)
                parentEl.removeChild(prevChild.el)
              }
            }
          }


          // diffWithKey1()
          diffFromTwoEnd()
          /**
           * 双端比较diff - vue/snabbdom
           */
          function diffFromTwoEnd() {
            let oldStartIdx = 0;
            let oldEndIdx = prevChildren.length - 1;
            let newStartIdx = 0;
            let newEndIdx = nextChildren.length - 1;
            let oldStartNode = prevChildren[oldStartIdx];
            let oldEndNode = prevChildren[oldEndIdx];
            let newStartNode = nextChildren[newStartIdx];
            let newEndNode = nextChildren[newEndIdx]
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              if (!oldStartNode) {
                oldStartNode = prevChildren[--oldStartIdx]
              } else if (!oldEndNode) {
                oldEndNode = prevChildren[--oldEndIdx]
              }
              else if (oldStartNode.key === newStartNode.key) {
                patch(oldStartNode, newStartNode, parentEl)
                oldStartNode = prevChildren[++oldStartIdx]
                newStartNode = nextChildren[++newStartIdx]
              } else if (oldEndNode.key === newEndNode.key) {
                // 旧的最后节点=新的最后节点
                patch(oldEndNode, newEndNode, parentEl)
                oldEndNode = prevChildren[--oldEndIdx]
                newEndNode = nextChildren[--newEndIdx]
              } else if (oldStartNode.key === newEndNode.key) {
                patch(oldStartNode, newEndNode, parentEl);
                parentEl.insertBefore(oldStartNode.el, newEndNode.el.nextSibling)
                oldStartNode = prevChildren[++oldStartIdx]
                newEndNode = nextChildren[--newEndIdx]
              } else if (oldEndNode.key === newStartNode.key) {
                patch(oldEndNode, newStartNode, parentEl)
                parentEl.insertBefore(oldEndNode.el, oldStartNode.el)
                oldEndNode = prevChildren[--oldEndIdx]
                newStartNode = nextChildren[++newStartIdx]
              } else {
                // 四次比较都没找到
                const idxInOld = prevChildren.findIndex(prevNode => prevNode.key === newStartNode.key);
                if (~idxInOld) {
                  const vnodeToMove = prevChildren[idxInOld];
                  patch(vnodeToMove, newStartNode, parentEl)
                  parentEl.insertBefore(vnodeToMove.el, oldStartNode.el);
                  prevChildren[idxInOld] = undefined;
                } else {
                  // 第一个是新节点
                  mount(newStartNode, parentEl, false, oldStartNode.el)

                }
                newStartNode = nextChildren[++newStartIdx]
              }
            }
            if (oldStartIdx > oldEndIdx) {
              // 循环结束后，旧节点退出循环时，可能新节点有未加入的节点
              // 插入到oldStartNode前，oldStartNode可能是0位置也可能是length位置
              for (let i = newStartIdx; i <= newEndIdx; i++) {
                mount(nextChildren[i], parentEl, false, oldStartNode.el)
              }
            }
            else if (newStartIdx > newEndIdx) {
              // 说明有旧节点需要移除
              for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                parentEl.removeChild(prevChildren[i].el);
              }
            }
          }

          /**
           * inferno 采用的diff
           * 先预处理相同的前缀后缀节点，再采用react方式判断是否移动元素
           * 再添加元素，删除元素
           */
          function infernoDiff() {
            let j = 0
            // 分两个end？两个长度可能不一样
            let prevEnd = prevChildren.length - 1
            let nextEnd = nextChildren.length - 1

            let prevNode = prevChildren[j]
            let nextNode = nextChildren[j]
            outer: {
              // 对前缀节点进行patch
              while (prevNode.key === nextNode.key) {
                patch(prevNode, nextNode, parentEl)
                j++
                if (j > prevEnd || j > nextEnd) {
                  break outer;
                }
                prevNode = prevChildren[j]
                nextNode = nextChildren[j]
              }
              // 对后缀节点进行patch
              prevNode = prevChildren[prevEnd]
              nextNode = nextChildren[nextEnd]
              while (prevNode.key === nextNode.key) {
                patch(prevNode, nextNode, parentEl)
                --prevEnd
                --nextEnd
                if (j > prevEnd || j > nextEnd) {
                  break outer;
                }
                prevNode = prevChildren[prevEnd]
                nextNode = nextChildren[nextEnd]
              }
            }
            if (j > prevEnd && j <= nextEnd) {
              // 添加新元素
              const nextPos = nextEnd + 1
              const refNode = nextPos < nextChildren.length ? nextChildren[nextPos].el : null
              while (j <= nextEnd) {
                mount(nextChildren[j], parentEl, false, refNode)
              }
            } else if (j > nextEnd && j <= prevEnd) {
              // 删除元素
              while (j <= prevEnd) {
                parentEl.removeChild(prevChildren[j].el)
              }

            } else {
              // 新旧节点数组没有为空的
              const nextLeftLength = nextEnd - j + 1; // 新children中未处理的节点数
              const source = [] // 映射新children节点在旧children中的位置，计算出最长递增子序列
              for (let i = 0; i < nextLeftLength; i++) {
                source.push[-1]
              }
              const prevStart = j;
              const nextStart = j;
              let moved = false;
              let pos = 0
              let patched = 0 // 已经更新的节点数量
              // 新节点索引表
              const keyIndex = {}
              for (let i = nextStart; i <= nextEnd; i++) {
                keyIndex[nextChildren[i].key] = i
              }
              // 遍历旧children未处理节点
              for (let i = prevStart; i <= prevEnd; i++) {
                let prevNode = prevChildren[i]
                if (patched < nextLeftLength) {
                  const k = keyIndex[prevNode.key];
                  if (isDef(k)) {
                    let nextNode = nextChildren[k];
                    patch(prevNode, nextNode, parentEl);
                    patched++
                    source[k - nextStart] = i
                    if (k < pos) {
                      moved = true
                    } else {
                      pos = k
                    }
                  } else {
                    // 旧节点不在新节点中，移除
                    parentEl.removeChild(prevNode.el)

                  }
                } else {
                  // 新节点中的已经都patch过，剩下的都是不需要的
                  parentEl.removeChild(prevNode.el)
                }
                // 需要移动
                if (moved) {
                  const seq = lis(source)
                  // 递增子序列的最后一个值
                  let j = seq.length - 1;
                  for (let i = nextLeftLength - 1; i >= 0; i--) {
                    if (source[i] === -1) {
                      // 新节点
                      const pos = i + nextStart // 在nextChildren中的真实位置
                      const nextNode = nextChildren[pos]
                      const nextPos = pos + 1
                      mount(nextNode, parentEl, false, nextPos < nextChildren.length ? nextChildren[nextPos].el : null)

                    }
                    if (i !== seq[j]) {
                      // 该节点需要移动
                      // 找到 该节点的后一个节点(li-g)，将其插入到 li-g 节点的前面即可，由于 li-g 节点已经被挂载，所以我们能够拿到它对应的真实 DOM
                      const pos = i + nextStart
                      const nextPos = pos + 1
                      mount(nextChildren[pos].el, parentEl, false, nextPos < nextChildren.length - 1 ? nextChildren[nextPos].el : null)
                    } else {
                      // 该位置节点无需移动
                      // 子序列的值前移
                      j--
                    }
                  }
                }

              }

            }
          }
        }
      }
    }
  }
}
function patchComponent(prevVNode, vnode, container) {
  console.log("patchComponent", prevVNode, vnode)
  if (vnode.tag !== prevVNode.tag) {
    // 前后更新渲染的不是同一组件，则直接替换
    replaceVnode(prevVNode, vnode, container)
    return;
  }
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFULL) {
    // 有状态组件更新
    // 更新时vnode=上一次的instance重新render的vnode，没有重新设置children
    // 而prevVnode是上次渲染的vnode，每次渲染时vnode.children都是当前实例，即new vnode.tag()
    // 此时的instance还是上一次渲染的组件，只是更改了$props
    const instance = (vnode.children = prevVNode.children);
    instance.$props = vnode.data;
    instance._update()
  } else {
    // 函数组件更新
    console.log("函数组件更新")
    console.log(prevVNode, vnode, container)
    // vnode.children=vnode.tag(vnode.data);
    // patch(prevVNode.children,vnode.children,container)
    const handle = vnode.handle = prevVNode.handle

    handle.prev = prevVNode;
    handle.next = vnode;
    handle.container = container;
    console.log(handle)
    handle.update()
  }

}
// 更新文本节点
function patchText(prevVNode, vnode, container) {
  const el = vnode.el = prevVNode.el;
  if (vnode.children !== prevVNode.children) {
    el.nodeValue = vnode.children;
  }
}

function patchFragment(prevVNode, vnode, container) {
  patchChildren(prevVNode.childFlags, vnode.childFlags, prevVNode.children, vnode.children, container)
  // 更新vnode的el
  switch (vnode.childFlags) {
    case childrenFlags.SINGLE_VNODE: {
      vnode.el = vnode.children.el;
      break
    }
    case childrenFlags.NO_CHILDREN: {
      // 新节点没有children，其el还是旧节点的el
      vnode.el = prevVNode.el;
      break;
    }
    default: {
      // 新节点的children是数组，el是第一个
      vnode.el = vnode.children[0].el
    }
  }
}

function patchPortal(prevVNode, vnode) {

  patchChildren(
    prevVNode.childFlags,
    vnode.childFlags,
    prevVNode.children,
    vnode.children,
    typeof prevVNode.tag === 'string' ? document.querySelector(prevVNode.tag) : prevVNode.tag
  )
  vnode.el = prevVNode.el; // 占位节点
  // 新旧节点挂载容器不同
  if (vnode.tag !== prevVNode.tag) {
    const container = typeof vnode.tag === 'string' ? document.querySelector(vnode.tag) : vnode.tag;
    switch (vnode.childFlags) {
      case childrenFlags.SINGLE_VNODE: {
        container.appendChild(vnode.children.el)
        break
      }
      case childrenFlags.NO_CHILDREN: {
        break
      }
      default: {
        for (let i = 0; i < vnode.children.length; i++) {
          container.appendChild(vnode.children[i].el)
        }
        break
      }
    }
  }
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
export default patch
