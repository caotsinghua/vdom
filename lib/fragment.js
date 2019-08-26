// 一个模板里有多个根元素，fragment
const Fragment={}
const fragmentNode={
    tag:Fragment,
    data:null,
    children:[
        {
            tag:'li',
            data:null
        },
        {
            tag:'li',
            data:null
        }
    ]
}

const Portal=Symbol("portal")
const portalVnode={
    tag:Portal,
    data:{
        target:"#app-root",

    },
    children:{
        tag:"div",
        data:{
            class:"overlay"
        }
    }
}
