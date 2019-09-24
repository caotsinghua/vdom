import VNodeFlags from './flags/vnode_flags'
import {mount} from './render'
import childrenFlags from './flags/children_flags';
export const patch=function(prevVNode,vnode,container){
  console.log('====patch====')
  const nextFlags=vnode.flags;
  const prevFlags=prevVNode.flags;

  if(prevFlags!==nextFlags){
    // 节点类型不一样
    console.log("replace vnode")
    replaceVnode(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.ELEMENT){
    console.log("patch element")
    patchElement(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.COMPONENT){
    console.log("patch component")
    patchComponent(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.TEXT){
    console.log("patch text")
    patchText(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.FRAGMENT){
    console.log("patch fragment")
    patchFragment(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.PORTAL){
    console.log("patch portal")
    patchPortal(prevVNode,vnode)
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
export const patchData=(el,key,prevValue,nextValue)=>{
  // innerHTML等
  const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/
  switch (key) {
    case 'style': {
      if(nextValue){
        for (let styleKey in nextValue) {
          el.style[styleKey] = nextValue[styleKey];
        }
      }else{
        for (let styleKey in prevValue) {
          delete el.style[styleKey]
        }
      }
      break;
    }
    case 'class': {
      if(nextValue){
        el.className = parseClassNames(nextValue)
      }else{
        el.className='';
      }
      break;
    }
    default: {
      if (/^on/.test(key)) {
        if(prevValue){
          el.removeEventListener(key.slice(2),prevValue);
        }
        if(nextValue){
          // 绑定事件
         el.addEventListener(key.slice(2), nextValue);
        }

      } else if (domPropsRE.test(key)) {
        // 作为dom prop处理
        element[key] = nextValue;
      } else {
        // 作为Attr处理
        element.setAttribute(key, nextValue);
      }
    }
  }
}
function replaceVnode(prevVNode,vnode,container){
  console.log("===replace-vnode===")
  // TODO:BUGS
  container.removeChild(prevVNode.el);
  mount(vnode,container)
}

function patchElement(prevVNode,vnode,container){
  console.log("=====patch-element====")
  if(prevVNode.tag!==vnode.tag){
    // 新旧节点标签不同
    replaceVnode(prevVNode,vnode,container)
    return
  }
  // 标签相同，比较内容，属性
  const el=vnode.el=prevVNode.el;
  console.log(el)
  const prevData=prevVNode.data;
  const nextData=vnode.data;

  if(nextData){

    // 存在新的data
    for(let key in nextData){
      const prevValue=prevData[key];
      const nextValue=nextData[key];
      patchData(el,key,prevValue,nextValue)
    }
  }
  if(prevData){
    for(let key in prevData){
      const prevValue=prevData[key];
      if(!nextData.hasOwnProperty(key)){
        patchData(el,key,prevValue,null)
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
function patchChildren(prevChildFlags,nextChildFlags,prevChildren,nextChildren,parentEl){
  console.log("patchChildren")
  switch(prevChildFlags){
    case childrenFlags.SINGLE_VNODE:{
      // 前一子节点为单节点
      switch(nextChildFlags){
        case childrenFlags.SINGLE_VNODE:{
          // 新节点为单节点
          console.log(prevChildren,nextChildren)
          patch(prevChildren,nextChildren,parentEl)
          break
        }
        case childrenFlags.NO_CHILDREN:{
          // 新节点无节点，即删除
          parentEl.removeChild(prevChildren.el);
          break;
        }
        default:{
          // 新子节点为多个节点
          parentEl.removeChild(prevChildren.el);
          for(let i=0;i<nextChildren.length;i++){
            mount(nextChildren[i],parentEl)
          }
        }
      }
    };
    case childrenFlags.NO_CHILDREN:{
      // 前一子节点为空
      switch(nextChildFlags){
        case childrenFlags.SINGLE_VNODE:{
          // 新节点为单节点
          mount(nextChildren,parentEl)
          break;
        }
        case childrenFlags.NO_CHILDREN:{
          // 新节点无节点，即删除
          break;
        }
        default:{
          // 新子节点为多个节点
          for(let i=0;i<nextChildren.length;i++){
            mount(nextChildren[i],parentEl)
          }
        }
      }
    };
    default:{
      // 前一子节点为多个节点
      console.log("前一子节点为多个节点")
      switch(nextChildFlags){
        case childrenFlags.SINGLE_VNODE:{
          // 新节点为单节点
          // 移除旧节点数组，挂载新节点
          for(let i =0;i<prevChildren.length;i++){
            parentEl.removeChild(prevChildren[i].el)
          }
          mount(nextChildren,parentEl)
          break;
        }
        case childrenFlags.NO_CHILDREN:{
          // 新节点无节点，即删除
          for(let i =0;i<prevChildren.length;i++){
            parentEl.removeChild(prevChildren[i].el)
          }
          break;
        }
        default:{
          console.log("新子节点为多个节点",nextChildren)
          // 新子节点为多个节点
          // TODO:diff
          console.log(parentEl)
          for(let i =0;i<prevChildren.length;i++){
            parentEl.removeChild(prevChildren[i].el)
          }
          for(let i =0;i<nextChildren.length;i++){
            mount(nextChildren[i],parentEl)
          }
        }
      }
    }
  }
}
function patchComponent(prevVNode,vnode,container){

}
// 更新文本节点
function patchText(prevVNode,vnode,container){
  const el=vnode.el=prevVNode.el;
  if(vnode.children!==prevVNode.children){
    el.nodeValue=vnode.children;
  }
}

function patchFragment(prevVNode,vnode,container){
  patchChildren(prevVNode.childFlags,vnode.childFlags,prevVNode.children,vnode.children,container)
  // 更新vnode的el
  switch(vnode.childFlags){
    case childrenFlags.SINGLE_VNODE:{
      vnode.el=vnode.children.el;
      break
    }
    case childrenFlags.NO_CHILDREN:{
      // 新节点没有children，其el还是旧节点的el
      vnode.el=prevVNode.el;
      break;
    }
    default:{
      // 新节点的children是数组，el是第一个
      vnode.el=vnode.children[0].el
    }
  }
}

function patchPortal(prevVNode,vnode){

  patchChildren(
    prevVNode.childFlags,
    vnode.childFlags,
    prevVNode.children,
    vnode.children,
    typeof prevVNode.tag==='string'?document.querySelector(prevVNode.tag):prevVNode.tag
  )
  vnode.el=prevVNode.el; // 占位节点
  // 新旧节点挂载容器不同
  if(vnode.tag!==prevVNode.tag){
    const container=typeof vnode.tag==='string'?document.querySelector(vnode.tag):vnode.tag;
    switch(vnode.childFlags){
      case childrenFlags.SINGLE_VNODE:{
        container.appendChild(vnode.children.el)
        break
      }
      case childrenFlags.NO_CHILDREN:{
        break
      }
      default:{
        for(let i=0;i<vnode.children.length;i++){
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
