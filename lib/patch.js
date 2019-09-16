import VNodeFlags from './flags/vnode_flags'
import mount from './render'
const patch=function(prevVNode,vnode,container){
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

function replaceVnode(prevVNode,vnode,container){
  // TODO:BUGS
  container.removeChild(prevVNode.el);
  mount(vnode,container)
}

function patchElement(prevVNode,vnode,container){
  if(prevVNode.tag!==vnode.tag){
    // 新旧节点标签不同
    replaceVnode(prevVNode,vnode,container)
  }else{

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
export default patch
