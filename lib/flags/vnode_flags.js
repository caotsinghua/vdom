/**
 * 虚拟dom的flag标识
 */
const VNodeFlags = {
  // html 标签
  ELEMENT_HTML: 1,
  // svg标签
  ELEMENT_SVG: 1 << 1,

  // 普通有状态组件
  COMPONENT_STATEFULL_NORMAL: 1 << 2,
  // 需要keepalive的组件
  COMPONENT_STATEFULL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 已经keepalive的组件
  COMPONENT_STATEFULL_KEPT_ALIVE: 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,
  TEXT: 1 << 6,//纯文本
  FRAGMENT: 1 << 7,
  PORTAL: 1 << 8,

}

VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG;// 标签元素
// 有状态组件，涵盖了这三个类型
VNodeFlags.COMPONENT_STATEFULL = VNodeFlags.COMPONENT_STATEFULL_NORMAL | VNodeFlags.COMPONENT_STATEFULL_KEPT_ALIVE | VNodeFlags.COMPONENT_STATEFULL_SHOULD_KEEP_ALIVE;
// 组件：包含有状态和无状态（函数式）
VNodeFlags.COMPONENT = VNodeFlags.COMPONENT_STATEFULL | VNodeFlags.COMPONENT_FUNCTIONAL;


export default VNodeFlags;

