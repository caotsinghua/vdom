interface ElementVNode {
    tag:string|ElementVNode|symbol|null;
    data:any|null;
    children:string|ElementVNode|Array<ElementVNode>;
}
