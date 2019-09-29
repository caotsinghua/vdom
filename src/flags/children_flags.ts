export const enum CHILDREN_FLAGS {
  // 未知的 children 类型
  UNKNOWN_CHILDREN = 0,
  // 没有 children
  NO_CHILDREN = 1,
  // children 是单个 VNode
  SINGLE_VNODE = 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES = 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES = 1 << 3,
  MULTIPLE_VNODES = CHILDREN_FLAGS.KEYED_VNODES | CHILDREN_FLAGS.NONE_KEYED_VNODES
}
