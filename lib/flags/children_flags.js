/**
 * 标签的子节点的情况
 */
const childrenFlags={
    // 未知的 children 类型
  UNKNOWN_CHILDREN: 0,
  // 没有 children
  NO_CHILDREN: 1,
  // children 是单个 VNode
  SINGLE_VNODE: 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES: 1 << 3
}
// 多节点标识
childrenFlags.MULTIPLE_VNODES=childrenFlags.KEYED_VNODES|childrenFlags.NONE_KEYED_VNODES;

export default childrenFlags;
