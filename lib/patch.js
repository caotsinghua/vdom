import VNodeFlags from './flags/vnode_flags'
import mount from './render'
export const patch=function(prevVNode,vnode,container){
  console.log('patch')
  const nextFlags=vnode.flags;
  const prevFlags=prevVNode.flags;
  if(prevFlags!==nextFlags){
    // 节点类型不一样
    replaceVnode(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.ElEMENT){
    patchElement(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.COMPONENT){
    patchComponent(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.TEXT){
    patchText(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.FRAGMENT){
    patchFragment(prevVNode,vnode,container)
  }else if(nextFlags&VNodeFlags.PORTAL){
    patchPortal(prevVNode,vnode,container)
  }
}
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
  // TODO:BUGS
  container.removeChild(prevVNode.el);
  mount(vnode,container)
}

function patchElement(prevVNode,vnode,container){
  if(prevVNode.tag!==vnode.tag){
    // 新旧节点标签不同
    replaceVnode(prevVNode,vnode,container)
    return
  }
  // 标签相同，比较内容，属性
  const el=vnode.el=prevVNode.el;
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
}

function patchComponent(prevVNode,vnode,container){

}
function patchText(prevVNode,vnode,container){

}

function patchFragment(prevVNode,vnode,container){

}

function patchPortal(prevVNode,vnode,container){

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
