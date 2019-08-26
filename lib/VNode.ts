export interface VNode{
  _isVNode:boolean,
  data:VNodeData|null,
  tag:string|null,
  flags:string,
  children:Array<any>|Object|null,
  childFlags:string
}

export interface VNodeData{
  props?:Object,
  [x:string]:any;
}
