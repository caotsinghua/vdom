
function render(vnode,container) {
    if(typeof vnode.tag === 'string'){
        mountElement(vnode,container);
    }else{
        mountComponent(vnode,container)
    }
}

function mountElement(vnode,container){
    const el=document.createElement(vnode.tag);
    el.innerHTML=vnode.children;
    container.appendChild(el);
}

function mountComponent(vnode,container){
    const instance=new vnode.tag(vnode.props);
    instance.$vnode=instance.render();
    mountElement(instance.$vnode,container);
}

class MyComponent{
    constructor(props){
        this.children=props.children;
    }
    render(){
        return {
            tag:'div',
            children:this.children
        }
    }
}

const node={
    tag:MyComponent,
    props:{
        children:"你哈"
    }
}
render(node,document.getElementById("app"))
